import Processor from 'postcss/lib/processor';
import tsModule from 'typescript/lib/tsserverlibrary';

import { Options } from '../types/options';
import { createDtsExports } from './createDtsExports';
import { getCssExports } from './getCssExports';
import { Logger } from '../types/logger';

export const getDtsSnapshot = (
  ts: typeof tsModule,
  processor: Processor,
  fileName: string,
  scriptSnapshot: ts.IScriptSnapshot,
  options: Options,
  logger: Logger
): tsModule.IScriptSnapshot => {
  const css = scriptSnapshot.getText(0, scriptSnapshot.getLength());

  const cssExports = getCssExports({
    css,
    fileName,
    logger,
    processor,
  });

  const dts = createDtsExports({ cssExports, fileName, logger, options });
  
  return ts.ScriptSnapshot.fromString(dts);
};
