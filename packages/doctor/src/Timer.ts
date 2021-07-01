const moment = require('moment');

export default class Timer {
  protected timer: ReturnType<typeof setTimeout>;

  protected startTime: number;

  protected endTime: undefined | number;

  constructor() {
    this.startTime = Date.now();
  }

  async raceTimeout(ms: number) {
    await new Promise((resolve) => {
      this.timer = setTimeout(resolve, ms);
    });
    throw new Error('@appworks/doctor time out!');
  }

  duration(): number {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    return moment.duration(Date.now() - this.startTime).asSeconds();
  }
}
