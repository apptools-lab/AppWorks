import { IScorerOptions } from './types/Scorer';

export default class Scanner {
  protected highestScore: number;

  protected lowestScore: number;

  protected digits: number;

  protected currentScore: number;

  constructor(options = {} as IScorerOptions) {
    this.highestScore = options.highestScore || 100;
    this.lowestScore = options.lowestScore || 10;
    this.digits = options.digits || 2;

    this.currentScore = options.start || this.highestScore;
  }

  plus(score: number): number {
    this.currentScore += score;
    return this.getScore();
  }

  minus(score: number): number {
    this.currentScore -= score;
    return this.getScore();
  }

  getAverage(list: number[]): number {
    if (list.length) {
      let sum = 0;

      if (list.length > 3) {
        // Calculate average without max and min
        list.sort((a, b) => a - b);
        list.pop();
        list.shift();
      }

      list.forEach((num) => {
        sum += num;
      });
      this.currentScore = sum / list.length;
    }
    return this.getScore();
  }

  getScore(): number {
    if (this.currentScore > this.highestScore) {
      return this.highestScore;
    } else if (this.currentScore < this.lowestScore) {
      return this.lowestScore;
    }
    // Avoid NaN
    return Number((this.currentScore || 0).toFixed(this.digits));
  }
}
