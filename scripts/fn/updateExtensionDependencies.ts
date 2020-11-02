import * as path from 'path';
import * as fs from 'fs-extra';
import { getPublishedPackages } from './published-info';

export default function updateExtensionDependencies(extension: string, directory: string) {
  try {
    const publishedPackages: string[] = getPublishedPackages();

    if (fs.existsSync(directory)) {
      const packageFile = path.join(directory, 'package.json');
      const packageData = fs.readJsonSync(packageFile);

      publishedPackages.forEach((publishedPackage: string) => {
        const info = publishedPackage.split(':');
        const name = info[0];
        const version = info[1];

        if (packageData.dependencies && packageData.dependencies[name]) {
          packageData.dependencies[name] = version;
        } else if (packageData.devDependencies && packageData.devDependencies[name]) {
          packageData.devDependencies[name] = version;
        }
      });
      fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2));
    }
  } catch (e) {
    console.log(`[ERROR] ${extension} update beta package dependencies failed.`, e);
  }
}
