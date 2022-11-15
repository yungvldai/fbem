import { CSSExports, extractICSS } from 'icss-utils';
import Processor from 'postcss/lib/processor';
import { RawSourceMap } from 'source-map-js';
import tsModule from 'typescript/lib/tsserverlibrary';

import { Options } from '../options';
import { Logger } from './logger';

export interface CSSExportsWithSourceMap {
  classes: CSSExports;
  css?: string;
  sourceMap?: RawSourceMap;
}

export const getCssExports = ({
  css,
  fileName,
  logger,
  options,
  processor,
  compilerOptions,
}: {
  css: string;
  fileName: string;
  logger: Logger;
  options: Options;
  processor: Processor;
  compilerOptions: tsModule.CompilerOptions;
}): CSSExportsWithSourceMap => {
  try {
    let sourceMap: string | undefined;

    const processedCss = processor.process(css, {
      from: fileName,
      map: {
        inline: false,
        prev: sourceMap,
      },
    });

    return {
      classes: processedCss.root
        ? // @ts-ignore
          extractICSS(processedCss.root).icssExports
        : {},
      css: processedCss.css,
      sourceMap: processedCss.map.toJSON(),
    };
  } catch (e) {
    logger.error(e as Error);
    return { classes: {} };
  }
};
