import { PLUGIN_NAME } from '../constants';
import { Logger } from '../types/logger';

export const createLogger = (info: ts.server.PluginCreateInfo): Logger => {
  const log = (message: string) => {
    info.project.projectService.logger.info(`[${PLUGIN_NAME} info] ${message}`);
  };

  const error = (error: Error) => {
    info.project.projectService.logger.info(
      `[${PLUGIN_NAME} error] ${error.toString()} ${error.stack}`
    );
  };

  return {
    log,
    error,
  };
};
