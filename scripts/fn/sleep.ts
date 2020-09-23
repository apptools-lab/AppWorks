export default function sleep(time: number) {
  console.log(`start sleep: ${time} ms`);
  return new Promise((resolve) => setTimeout(resolve, time));
}
