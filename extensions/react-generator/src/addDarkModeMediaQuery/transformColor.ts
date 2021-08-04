import * as Color from 'color';

const RATIO = 0.1;

function parseColor(value: string) {
  try {
    return Color(value);
  } catch (e) {
    return null;
  }
}

export default function transformColor(color: string): string {
  let outputColor = parseColor(color);
  const inputColor = parseColor(color);

  if (inputColor.hex() === '#FFFFFF') {
    // https://material.io/design/color/dark-theme.html
    outputColor = parseColor(`rgba(18, 18, 18, ${inputColor.valpha})`);
    return color.includes('rgb') ? outputColor.rgb() : outputColor.hex();
  }

  const hslColor = inputColor.hsl();

  if (hslColor && hslColor.valpha === 0) {
    return 'transparent';
  } else if (hslColor.color) {
    let h = hslColor.color[0];
    let s = hslColor.color[1];
    let light = hslColor.color[2];

    if (!hslColor.color[0] && !hslColor.color[1]) {
      h = 0;
      s = 0;
    }

    light = 100 - light * (1 - RATIO);
    if (light <= 10) {
      light += 10;
    } else {
      light = light >= 90 ? light - 10 : light;
    }

    outputColor = parseColor(`hsla(${h}, ${s}%, ${light}%, ${hslColor.valpha})`);
  }

  // Set opacity
  switch (inputColor.model) {
    case 'rgb':
      return color.includes('rgb') ? outputColor.rgb().string() : outputColor.hex();
    case 'hsl':
      return outputColor.hsl().string();
    default:
      return color;
  }
}
