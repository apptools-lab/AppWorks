export default class Timer {
  protected endTime: undefined | number;

  constructor(timeout?: number) {
    if (timeout) {
      this.endTime = Date.now() + timeout;
    }
  }

  public checkTimeout(): void {
    if (this.endTime && Date.now() > this.endTime) {
      throw new Error('@iceworks/doctor time out!');
    }
  }
}
