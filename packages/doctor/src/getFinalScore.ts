import Scorer from './Scorer';

function getTwoMinNums(arr: number[]): number[] {
  let a = arr[0];
  let b = arr[1];
  if (a < b) {
    const temp = a;
    a = b;
    b = temp;
  }
  for (let i = 2; i < arr.length; i++) {
    if (arr[i] > a) {
      b = a;
      a = arr[i];
    } else if (arr[i] < a && arr[i] > b) {
      b = arr[i];
    }
  }
  return [a, b];
}

// Case1: calculate dimensions is 5
// Weighted Average:
// 0.8 (fixed weight, divided equally by 5 dimensions) + 0.2 (dynamic weight, divided equally by the 2 dimensions with the lowest score)
// For example, the scores are: 90, 90, 20, 100, 75 (the lowest score is 20 and 75)
// 90*0.16+90*0.16+20*0.16+100*0.16+75*0.16 + 20*0.1+75*0.1  = 69.5
//
// Case2: calculate dimensions less than 5
// return average
export default function getFinalScore(arr: number[]): number {
  let finalScore = 0;

  if (arr.length === 5) {
    finalScore += arr.reduce((total, score) => total + score) * 0.16;
    finalScore += getTwoMinNums(arr).reduce((total, score) => total + score) * 0.1;
  } else {
    finalScore = new Scorer().getAverage(arr);
  }

  return Number(finalScore.toFixed(2));
}
