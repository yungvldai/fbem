import fs from 'fs';
import path from 'path';
import { AcceptedPlugin } from 'postcss';
import filter from 'postcss-filter-plugins';
import postcssrc from 'postcss-load-config';
import tsModule from 'typescript/lib/tsserverlibrary';

import { Options } from './options';
import { getDtsSnapshot } from './utils/getDtsSnapshot';
import { getProcessor } from './utils/getProcessor';
import { createLogger } from './utils/logger';
import { createIsCSS, isRelative } from './utils/predicates';

const getPostCssConfigPlugins = (directory: string) => {
  try {
    return postcssrc.sync({}, directory).plugins;
  } catch (error) {
    return [];
  }
};

function init({ typescript: ts }: { typescript: typeof tsModule }) {
  let isCSS: (fileName: string) => boolean;

  const create = (info: ts.server.PluginCreateInfo) => {
    const logger = createLogger(info);
    const directory = info.project.getCurrentDirectory();
    const compilerOptions = info.project.getCompilerOptions();

    // TypeScript plugins have a `cwd` of `/`, which causes issues with import resolution.
    process.chdir(directory);

    // User options for plugin.
    const options: Options = info.config.options || {};

    // Add postCSS config if enabled.
    const postcssOptions = options.postcssOptions || {};

    let userPlugins: AcceptedPlugin[] = [];
    if (postcssOptions.useConfig) {
      const postcssConfig = getPostCssConfigPlugins(directory);
      userPlugins = [
        filter({
          exclude: postcssOptions.excludePlugins,
          silent: true,
        }),
        ...postcssConfig,
      ];
    }

    // Create PostCSS processor.
    const processor = getProcessor(userPlugins);

    isCSS = createIsCSS(new RegExp(options.match));

    // Creates new virtual source files for the CSS modules.
    const _createLanguageServiceSourceFile = ts.createLanguageServiceSourceFile;
    ts.createLanguageServiceSourceFile = (fileName, scriptSnapshot, ...rest): ts.SourceFile => {
      if (isCSS(fileName)) {
        scriptSnapshot = getDtsSnapshot(
          ts,
          processor,
          fileName,
          scriptSnapshot,
          options,
          logger,
          compilerOptions
        );
      }
      const sourceFile = _createLanguageServiceSourceFile(fileName, scriptSnapshot, ...rest);
      if (isCSS(fileName)) {
        sourceFile.isDeclarationFile = true;
      }
      return sourceFile;
    };

    // Updates virtual source files as files update.
    const _updateLanguageServiceSourceFile = ts.updateLanguageServiceSourceFile;
    ts.updateLanguageServiceSourceFile = (sourceFile, scriptSnapshot, ...rest): ts.SourceFile => {
      if (isCSS(sourceFile.fileName)) {
        scriptSnapshot = getDtsSnapshot(
          ts,
          processor,
          sourceFile.fileName,
          scriptSnapshot,
          options,
          logger,
          compilerOptions
        );
      }
      sourceFile = _updateLanguageServiceSourceFile(sourceFile, scriptSnapshot, ...rest);
      if (isCSS(sourceFile.fileName)) {
        sourceFile.isDeclarationFile = true;
      }
      return sourceFile;
    };

    if (info.languageServiceHost.resolveModuleNames) {
      const _resolveModuleNames = info.languageServiceHost.resolveModuleNames.bind(
        info.languageServiceHost
      );

      info.languageServiceHost.resolveModuleNames = (moduleNames, containingFile, ...rest) => {
        const resolvedModules = _resolveModuleNames(moduleNames, containingFile, ...rest);

        return moduleNames.map((moduleName, index) => {
          try {
            if (isCSS(moduleName) && isRelative(moduleName)) {
              return {
                extension: tsModule.Extension.Dts,
                isExternalLibraryImport: false,
                resolvedFileName: path.resolve(path.dirname(containingFile), moduleName),
              };
            } else if (isCSS(moduleName)) {
              // TODO: Move this section to a separate file and add basic tests.
              // Attempts to locate the module using TypeScript's previous search paths. These include "baseUrl" and "paths".
              const failedModule = info.project.getResolvedModuleWithFailedLookupLocationsFromCache(
                moduleName,
                containingFile
              );
              const baseUrl = info.project.getCompilerOptions().baseUrl;
              const match = '/index.ts';

              // An array of paths TypeScript searched for the module. All include .ts, .tsx, .d.ts, or .json extensions.
              // NOTE: TypeScript doesn't expose this in their interfaces, which is why the type is unkown.
              // https://github.com/microsoft/TypeScript/issues/28770
              const failedLocations: readonly string[] = (
                failedModule as unknown as {
                  failedLookupLocations: readonly string[];
                }
              ).failedLookupLocations;

              // Filter to only one extension type, and remove that extension. This leaves us with the actual filename.
              // Example: "usr/person/project/src/dir/File.module.css/index.d.ts" > "usr/person/project/src/dir/File.module.css"
              const normalizedLocations = failedLocations.reduce((locations, location) => {
                if ((baseUrl ? location.includes(baseUrl) : true) && location.endsWith(match)) {
                  return [...locations, location.replace(match, '')];
                }
                return locations;
              }, [] as string[]);

              // Find the imported CSS module, if it exists.
              const cssModulePath = normalizedLocations.find((location) => fs.existsSync(location));

              if (cssModulePath) {
                return {
                  extension: tsModule.Extension.Dts,
                  isExternalLibraryImport: false,
                  resolvedFileName: path.resolve(cssModulePath),
                };
              }
            }
          } catch (e) {
            logger.error(e as Error);
            return resolvedModules[index];
          }
          return resolvedModules[index];
        });
      };
    }

    return info.languageService;
  };

  const getExternalFiles = (project: tsModule.server.ConfiguredProject) =>
    project.getFileNames().filter(isCSS);

  return { create, getExternalFiles };
}

export = init;
