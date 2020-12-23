// Case1: calculate dimensions is 1
// return current score
//
// Case2: calculate dimensions more than 1
// Weighted Average:
// 0.9 (fixed weight, for all dimensions) + 0.1 (additional weight, for the lowest score)
// For example, the scores are: 90, 90, 20 (the lowest score is 20)
// (90*(0.9/3) + 90*(0.9/3) + 20*(0.9/3)) + 20 * 0.1 = 62

const ADDITIONAL_WEIGHT = 0.1;

export default function getFinalScore(arr: number[]): number {
  let finalScore = 0;

  if (arr.length === 1) {
    finalScore = arr[0];
  } else {
    arr.sort((a, b) => a - b).forEach((score, index) => {
      if (index === 0) {
        finalScore += score * ADDITIONAL_WEIGHT;
      }
      finalScore += (1 - ADDITIONAL_WEIGHT) / arr.length * score;
    });
  }

  return Number(finalScore.toFixed(2));
}
