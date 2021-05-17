export function convertNumToPixel(num) {
  return `${num}px`;
}

export function convertPixelToNum(pixel, returnInteger = true) {
  try {
    return returnInteger ? parseInt(pixel.slice(0, -2)) : parseFloat(pixel.slice(0, -2));
  } catch (e) {
    return 100;
  }
}

export const throttle = (fn, delay) => {
  let timer;

  return function () {
    if (timer) {
      return;
    }
    const args = arguments;
    timer = setTimeout(function () {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
};
