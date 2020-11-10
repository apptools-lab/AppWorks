import Scorer from './Scorer';

// Case1: calculate dimensions is 3
// Weighted Average:
// 0.6 (fixed weight, divided equally by 2 dimensions) + 0.4 (dynamic weight, divided equally by the 1 dimensions with the lowest score)
// For example, the scores are: 90, 90, 20 (the lowest score is 20)
// 90*0.3+90*0.3+20*0.4 = 62
//
// Case2: calculate dimensions less than 3
// return average
export default function getFinalScore(arr: number[]): number {
  let finalScore = 0;

  if (arr.length === 3) {
    arr.sort((a, b) => a - b).forEach((score, index) => {
      if (index === 0) {
        finalScore += score * 0.4;
      } else {
        finalScore += score * 0.3;
      }
    });
  } else {
    finalScore = new Scorer().getAverage(arr);
  }

  return Number(finalScore.toFixed(2));
}
