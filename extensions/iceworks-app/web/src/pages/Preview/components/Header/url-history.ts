export class UrlHistory {
  public maxLength: number;

  private past = [];

  private present = undefined;

  private future = [];

  /**
   * create a new UrlHistory
   * @param maxLength maximum number of past entries that should be stored (default=50)
   */
  constructor(maxLength = 50) {
    this.maxLength = maxLength;
  }

  push(state) {
    if (this.present !== undefined) this.past.push(this.present);
    this.present = state;
    if (this.future.length) this.future = [];
    if (this.past.length > this.maxLength) {
      this.past.splice(0, this.past.length - this.maxLength);
    }
    return this.present;
  }

  go(i: number) {
    if (i === 0) {
      return this.present;
    }
    if (i > 0) {
      const newPresent = this.future.splice(i - 1, 1)[0];
      this.past = [...this.past, this.present, ...this.future.splice(0, i - 1)];
      this.present = newPresent;
      return this.present;
    } else {
      const start = this.past.length + i;
      const newPresent = this.past.splice(start, 1)[0];
      this.future = [
        ...this.past.splice(start, this.past.length - start),
        this.present,
        ...this.future,
      ];
      this.present = newPresent;
      return this.present;
    }
  }

  canGo(i: number) {
    if (i === 0) {
      return !!this.present;
    }
    if (i > 0) {
      return !!this.future[i - 1];
    } else {
      return !!this.past[this.past.length + i];
    }
  }

  get(i: number) {
    if (i === 0) {
      return this.present;
    }
    if (i > 0) {
      return this.future[i - 1];
    } else {
      return this.past[this.past.length + i];
    }
  }
}
