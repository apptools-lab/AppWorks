import * as path from 'path';
import * as fse from 'fs-extra';
import { isAliNpm } from 'ice-npm-utils';
import { ITemplateOptions } from './index';

interface IOptions {
  rootDir: string;
  templateOptions?: ITemplateOptions;
  enableDefPublish?: boolean;
  enablePegasus?: boolean;
  materialType?: 'component' | 'block' | 'scaffold';
}

export default async function formatProject({
  rootDir,
  templateOptions,
  enableDefPublish,
  enablePegasus,
  materialType,
}: IOptions): Promise<void> {
  const { npmName } = templateOptions;
  const abcPath = path.join(rootDir, 'abc.json');
  const pkgPath = path.join(rootDir, 'package.json');
  const buildJsonPath = path.join(rootDir, 'build.json');
  const buildData = fse.readJsonSync(buildJsonPath);
  const pkgData = fse.readJsonSync(pkgPath);
  let abcData = null;

  // fusion cool adaptor
  if (materialType === 'component' && templateOptions.adaptor) {
    const templatePath = path.join(__dirname, './template/componentAdaptor');
    await fse.copy(templatePath, rootDir);
  }

  if (isAliNpm(npmName)) {
    pkgData.publishConfig = {
      registry: 'https://registry.npm.alibaba-inc.com',
    };
  }

  if (materialType === 'component' || enableDefPublish || enablePegasus) {
    abcData = {
      builder: '@ali/builder-component',
    };

    if (enablePegasus) {
      pkgData.devDependencies['@ali/build-plugin-rax-seed'] = '^1.0.0';
      buildData.plugins.push([
        '@ali/build-plugin-rax-seed',
        {
          majorVersionIsolation: false,
        },
      ]);
    }
  }

  abcData && fse.writeJSONSync(abcPath, abcData, { spaces: 2 });
  fse.writeJSONSync(buildJsonPath, buildData, { spaces: 2 });
  fse.writeJSONSync(pkgPath, pkgData, { spaces: 2 });
}
