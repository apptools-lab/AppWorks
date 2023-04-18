import * as path from 'path';
import * as fse from 'fs-extra';
import { checkAliInternal } from 'ice-npm-utils';

export default async function writeAbcJson(projectDir: string) {
  const isAliInternal = await checkAliInternal();

  // abc.json for internal.
  if (isAliInternal) {
    const abcPath = path.join(projectDir, 'abc.json');
    if (!fse.existsSync(abcPath)) {
      const abcData = {
        type: 'ice-app',
        builder: '@ali/builder-ice-v3',
      };
      fse.writeJSONSync(abcPath, abcData, {
        spaces: 2,
      });
      console.log(`Generated ${abcPath}.\n`);
    }
  }
}
