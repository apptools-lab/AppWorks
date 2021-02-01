const moment = require('moment');

export default class Timer {
  protected timer: ReturnType<typeof setTimeout>;

  protected startTime: number;

  protected endTime: undefined | number;

  constructor(timeout?: number) {
    this.timer = null;
    this.startTime = Date.now();

    if (timeout) {
      this.timer = setTimeout(() => {
        throw new Error('@iceworks/doctor time out!');
      }, timeout);
    }
  }

  public duration(): number {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return moment.duration(Date.now() - this.startTime).asSeconds();
  }
}
