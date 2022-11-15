import Processor from 'postcss/lib/processor';
import tsModule from 'typescript/lib/tsserverlibrary';

import { Logger } from '../types/logger';
import { Options } from '../types/options';
import { createDtsExports } from './createDtsExports';
import { getCssExports } from './getCssExports';

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

  const dts = createDtsExports({ cssExports, options });
  return ts.ScriptSnapshot.fromString(dts);
};
