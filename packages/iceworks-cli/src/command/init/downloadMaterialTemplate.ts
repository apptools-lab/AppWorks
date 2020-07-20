import * as fse from 'fs-extra';
import getNpmTarball from '../../utils/getNpmTarball';
import getNpmRegistry from '../../utils/getNpmRegistry';
import extractTarball from '../../utils/extractTarball';
import { TEMP_PATH } from '../../utils/constants';

export default async (template: string, materialConfig?: any): Promise<string> => {
  await fse.emptyDir(TEMP_PATH);

  if (isLocalPath(template)) {
    await fse.copy(template, TEMP_PATH);
  } else {
    const registry = await getNpmRegistry(template, materialConfig, null, true);
    const tarballURL = await getNpmTarball(template, 'latest', registry);
    await extractTarball({
      tarballURL,
      destDir: TEMP_PATH,
    });
  }
  return TEMP_PATH;
};

function isLocalPath(filepath: string): boolean {
  return /^[./]|(^[a-zA-Z]:)/.test(filepath);
}
