const moment = require('moment');

export default class Timer {
  protected timer: ReturnType<typeof setTimeout>;

  protected startTime: number;

  protected endTime: undefined | number;

  constructor() {
    this.startTime = Date.now();
  }

  public async raceTimeout(ms: number) {
    await new Promise(resolve => {
      this.timer = setTimeout(resolve, ms);
    });
    throw new Error('@iceworks/doctor time out!');
  }

  public duration(): number {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return moment.duration(Date.now() - this.startTime).asSeconds();
  }
}
