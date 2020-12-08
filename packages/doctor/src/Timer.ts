const moment = require('moment');

export default class Timer {
  protected startTime: number;

  protected endTime: undefined | number;

  constructor(timeout?: number) {
    this.startTime = Date.now();
    if (timeout) {
      this.endTime = this.startTime + timeout;
    }
  }

  public checkTimeout(): void {
    if (this.endTime && Date.now() > this.endTime) {
      throw new Error('@iceworks/doctor time out!');
    }
  }

  public duration(): number {
    return moment.duration(Date.now() - this.startTime).asSeconds();
  }
}
