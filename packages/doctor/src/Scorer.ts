import { IScorerOptions } from './types/Scorer';

export default class Scanner {
  protected highestScore: number;
  protected lowestScore: number;
  protected currentScore: number;

  constructor(options = <IScorerOptions>{}) {
    this.highestScore = options.highestScore || 100;
    this.lowestScore = options.lowestScore || 0;

    this.currentScore = this.highestScore;
  }

  public plus(score: number): number {
    this.currentScore += score;
    return this.getScore();
  }

  public minus(score: number): number {
    this.currentScore -= score;
    return this.getScore();
  }

  public getAverage(list: number[]): number {
    let sum = 0;

    list.sort((a, b) => a - b);

    list.pop();
    list.shift();

    list.forEach(num => sum += num);
    this.currentScore = sum / list.length;

    return this.getScore();
  }

  public getScore(): number {
    if (this.currentScore > this.highestScore) {
      return this.highestScore;
    } else if (this.currentScore < this.lowestScore) {
      return this.lowestScore;
    }
    // Avoid NaN
    return this.currentScore || 0;
  }
}
