import * as npmlog from 'npmlog';

const envs = ['verbose', 'info', 'error', 'warn'];
const logLevel =
  envs.indexOf(process.env.LOG_LEVEL) !== -1 ? process.env.LOG_LEVEL : 'info';

// @ts-ignore
npmlog.level = logLevel;

export default npmlog;
