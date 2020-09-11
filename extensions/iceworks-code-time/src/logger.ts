import { LogLevel } from './constants';

export class Logger {
  private level: LogLevel;

  constructor(level: LogLevel) {
    this.setLevel(level);
  }

  public getLevel(): LogLevel {
    return this.level;
  }

  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  public log(level: LogLevel, msg: string, args?: any): void {
    if (level >= this.level) {
      msg = `[VScodeTime][${LogLevel[level]}] ${msg}`;
      args = args || '';
      if (level == LogLevel.DEBUG) console.log(msg, args);
      if (level == LogLevel.INFO) console.info(msg, args);
      if (level == LogLevel.WARN) console.warn(msg, args);
      if (level == LogLevel.ERROR) console.error(msg, args);
    }
  }

  public debug(msg: string, args?: any): void {
    this.log(LogLevel.DEBUG, msg, args);
  }

  public info(msg: string, args?: any): void {
    this.log(LogLevel.INFO, msg, args);
  }

  public warn(msg: string, args?: any): void {
    this.log(LogLevel.WARN, msg, args);
  }

  public error(msg: string, args?: any): void {
    this.log(LogLevel.ERROR, msg, args);
  }
}
