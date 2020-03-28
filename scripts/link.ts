import * as path from 'path';
import { run } from './fn/shell';

const appDir = path.resolve(__dirname, '../app');

(async function() {
  const packages = [
    '@iceworks/config',
    '@iceworks/project-generate'
  ];

  packages.forEach(async (item) => {
    await run(`cd ${appDir} && rm -rf node_modules/${item}`);
  });

})().catch(e => {
  console.trace(e);
  process.exit(128);
});
