import Datauri from 'datauri';
import tinycolor from 'tinycolor2';

// VS Code's hover and completion card only support markdown or string. Not support HTML.
// Use markdown image preview current display color.
// Return ![](base64 ....)
// See: https://stackoverflow.com/questions/22384934/how-to-change-svg-fill-color-when-used-as-base-64-background-image-data
export default function colorPreviewDisplay(value: string): string {
  const color = tinycolor(value);
  if (!color.isValid()) return '';

  // @ts-ignore
  const datauri = new Datauri();

  const width = 12;
  const height = 12;

  const src = `<?xml version="1.0" encoding="utf-8"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" style="background-color: white;"
      width="${width}px" height="${height}px" viewBox="0 0 ${width} ${height}" xml:space="preserve"
    >
    <rect width="${width}" height="${height}" fill="${color.toHexString()}" fill-opacity="${color.getAlpha()}" />
    <polygon points="0,0 ${width},0 ${width},${height}" fill="${color.toHexString()}" />
    <rect width="${width}" height="${height}" fill-opacity="0" stroke="gray" strokeWidth="1" />
  </svg>`;

  datauri.format('.svg', src);
  return `![](${datauri.content})`;
}
