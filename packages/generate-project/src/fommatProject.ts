import * as path from 'path';
import * as fse from 'fs-extra';
import { checkAliInternal } from 'ice-npm-utils';

export default async function formatProject(projectDir: string): Promise<void> {
  await fse.remove(path.join(projectDir, 'build'));

  let abcData = {};
  const abcPath = path.join(projectDir, 'abc.json');
  const pkgPath = path.join(projectDir, 'package.json');
  const pkgData = fse.readJsonSync(pkgPath);
  const isAliInternal = await checkAliInternal();

  pkgData.dependencies = pkgData.dependencies || {};
  pkgData.devDependencies = pkgData.devDependencies || {};

  console.info('clean package.json...');

  // modify package.json
  pkgData.private = true;
  pkgData.originTemplate = pkgData.name;
  delete pkgData.files;
  delete pkgData.publishConfig;
  delete pkgData.scaffoldConfig;
  delete pkgData.homepage;
  if (pkgData.scripts) {
    delete pkgData.scripts.screenshot;
    delete pkgData.scripts.prepublishOnly;
  }
  delete pkgData.devDependencies['@ice/screenshot'];

  const buildJsonPath = path.join(projectDir, 'build.json');
  if (fse.existsSync(buildJsonPath)) {
    console.debug('formatProject', 'build-scripts project');

    const buildJsonPath = path.join(projectDir, 'build.json');
    const buildData = fse.readJsonSync(buildJsonPath);
    buildData.plugins = buildData.plugins || [];

    delete buildData.publicPath;

    if (isAliInternal) {

      if (pkgData.dependencies.rax) {
        // For Rax project
        abcData = {
          type: 'rax',
          builder: '@ali/builder-rax-v1',
          info: {
            raxVersion: '1.x'
          }
        };

        // add @ali/build-plugin-rax-app-def
        pkgData.devDependencies['@ali/build-plugin-rax-app-def'] = '^1.0.2';
        buildData.plugins.push('@ali/build-plugin-rax-app-def');

      } else {

        abcData = {
          type: 'ice-app',
          builder: '@ali/builder-ice-app',
        };

        // add @ali/build-plugin-ice-def
        pkgData.devDependencies['@ali/build-plugin-ice-def'] = '^0.1.0';
        buildData.plugins.push('@ali/build-plugin-ice-def');
      }
    }

    // delete build-plugin-fusion-material
    const index = buildData.plugins.findIndex((item) => {
      const pluginName = typeof item === 'string' ? item : item[0];
      return pluginName === 'build-plugin-fusion-material';
    });
    if (index !== -1) {
      buildData.plugins.splice(index, 1);
      delete pkgData.devDependencies['build-plugin-fusion-material'];
    }

    fse.writeJSONSync(buildJsonPath, buildData, {
      spaces: 2,
    });
  } else if (pkgData.devDependencies['ice-scripts']) {
    console.debug('formatProject', 'ice-scripts project');
    const buildVersion = pkgData.devDependencies['ice-scripts'];
    // ^1.y.z, ~1.y.z, 1.x
    const is1X = /^(\^|~|)1\./.test(buildVersion);
    abcData = {
      type: 'ice-scripts',
      builder: is1X ? '@ali/builder-iceworks' : '@ali/builder-ice-scripts',
    };

    if (!is1X) {
      // TODO: 操作 ice.config.js 加入 ice-plugin-def；删除 publicPath；
      console.info('If you need to deploy with DEF, please refer to the doc: https://yuque.alibaba-inc.com/ice/rdy99p/angwyx');
    } else if (pkgData.buildConfig) {
      delete pkgData.buildConfig.output;
      delete pkgData.buildConfig.localization;
    }
  }

  if (isAliInternal) {
    fse.writeJSONSync(abcPath, abcData, {
      spaces: 2,
    });
  }

  fse.writeJSONSync(pkgPath, pkgData, {
    spaces: 2,
  });
}
