import Processor from 'postcss/lib/processor';
import tsModule from 'typescript/lib/tsserverlibrary';

import { Options } from '../options';
import { createDtsExports } from './createDtsExports';
import { getCssExports } from './getCssExports';
import { Logger } from './logger';

export const getDtsSnapshot = (
  ts: typeof tsModule,
  processor: Processor,
  fileName: string,
  scriptSnapshot: ts.IScriptSnapshot,
  options: Options,
  logger: Logger,
  compilerOptions: tsModule.CompilerOptions
): tsModule.IScriptSnapshot => {
  const css = scriptSnapshot.getText(0, scriptSnapshot.getLength());

  const cssExports = getCssExports({
    css,
    fileName,
    logger,
    options,
    processor,
    compilerOptions,
  });
  const dts = createDtsExports({ cssExports, fileName, logger, options });
  return ts.ScriptSnapshot.fromString(dts);
};
