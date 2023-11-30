import * as path from 'path';
import * as fse from 'fs-extra';
import { isAliNpm } from 'ice-npm-utils';
import { ITemplateOptions } from './types';

interface IOptions {
  rootDir: string;
  templateOptions?: ITemplateOptions;
  enableDefPublish?: boolean;
  enablePegasus?: boolean;
  builder?: string;
  materialType?: 'component' | 'block' | 'scaffold';
}

export default async function formatProject({
  rootDir,
  templateOptions,
  enableDefPublish,
  enablePegasus,
  builder = '',
  materialType,
}: IOptions): Promise<void> {
  const { npmName } = templateOptions;
  const abcPath = path.join(rootDir, 'abc.json');
  const pkgPath = path.join(rootDir, 'package.json');
  const buildJsonPath = path.join(rootDir, 'build.json');

  const buildData = fse.existsSync(buildJsonPath) ? fse.readJsonSync(buildJsonPath) : null;
  const pkgData = fse.readJsonSync(pkgPath);
  let abcData = null;

  if (isAliNpm(npmName)) {
    pkgData.publishConfig = {
      registry: 'https://registry.anpm.alibaba-inc.com',
    };
  }

  if (materialType === 'component' || enableDefPublish || enablePegasus) {
    abcData = {
      builder: builder || '@ali/builder-component',
    };

    if (enablePegasus) {
      pkgData.devDependencies['@ali/build-plugin-rax-seed'] = '^2.0.0';
      buildData && buildData.plugins.push([
        '@ali/build-plugin-rax-seed',
        {
          majorVersionIsolation: false,
        },
      ]);
    }
  }

  abcData && fse.writeJSONSync(abcPath, abcData, { spaces: 2 });
  buildData && fse.writeJSONSync(buildJsonPath, buildData, { spaces: 2 });
  fse.writeJSONSync(pkgPath, pkgData, { spaces: 2 });
}
