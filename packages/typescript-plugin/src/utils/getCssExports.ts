import { CSSExports, extractICSS } from 'icss-utils';
import Processor from 'postcss/lib/processor';
import { RawSourceMap } from 'source-map-js';

import { Logger } from '../types/logger';

export interface CSSExportsWithSourceMap {
  classes: CSSExports;
  css?: string;
  sourceMap?: RawSourceMap;
}

export const getCssExports = ({
  css,
  fileName,
  logger,
  processor,
}: {
  css: string;
  fileName: string;
  logger: Logger;
  processor: Processor;
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
