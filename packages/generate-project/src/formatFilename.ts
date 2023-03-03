/**
 * 下载 npm 后的文件名处理
 */
export default function formatFilename(filename: string) {
  // 只转换特定文件，防止误伤
  const dotFilenames = [
    '_gitignore',
    '_eslintrc.js',
    '_eslintrc.cjs',
    '_eslintrc',
    '_eslintignore',
    '_stylelintrc.js',
    '_stylelintrc.cjs',
    '_stylelintrc',
    '_stylelintignore',
    '_editorconfig',
    '_prettierrc.js',
    '_prettierignore',
  ];
  if (dotFilenames.indexOf(filename) !== -1) {
    // _eslintrc.js -> .eslintrc.js
    filename = filename.replace(/^_/, '.');
  }

  return filename;
}
