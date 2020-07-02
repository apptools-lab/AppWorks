import * as fsExtra from 'fs-extra';

import request = require('request-promise');
import semver = require('semver');
import fs = require('fs');
import mkdirp = require('mkdirp');
import path = require('path');
import urlJoin = require('url-join');
import progress = require('request-progress');
import zlib = require('zlib');
import tar = require('tar');

/**
 * 获取指定 npm 包版本的 tarball
 */
function getNpmTarball(npm: string, version?: string, registry?: string): Promise<string> {
  return getNpmInfo(npm, registry).then((json: any) => {
    if (!semver.valid(version)) {
      version = json['dist-tags'].latest;
    }

    if (
      semver.valid(version) &&
      json.versions &&
      json.versions[version] &&
      json.versions[version].dist
    ) {
      return json.versions[version].dist.tarball;
    }

    return Promise.reject(new Error(`${name}@${version} 尚未发布`));
  });
}

/**
 * 获取 tar 并将其解压到指定的文件夹
 */
function getAndExtractTarball(
  destDir: string,
  tarball: string,
  progressFunc = (state) => { },
  formatFilename = (filename: string): string => {
    // 为了兼容
    if (filename === '_package.json') {
      return filename.replace(/^_/, '');
    } else {
      return filename.replace(/^_/, '.');
    }
  }
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const allFiles = [];
    const allWriteStream = [];
    const dirCollector = [];

    progress(
      request({
        url: tarball,
        timeout: 10000,
      })
    )
      .on('progress', progressFunc)
      .on('error', reject)
      // @ts-ignore
      .pipe(zlib.Unzip())
      // @ts-ignore
      .pipe(new tar.Parse())
      .on('entry', (entry) => {
        if (entry.type === 'Directory') {
          entry.resume();
          return;
        }
        const realPath = entry.path.replace(/^package\//, '');

        let filename = path.basename(realPath);
        filename = formatFilename(filename);

        const destPath = path.join(destDir, path.dirname(realPath), filename);
        const dirToBeCreate = path.dirname(destPath);
        if (!dirCollector.includes(dirToBeCreate)) {
          dirCollector.push(dirToBeCreate);
          mkdirp.sync(dirToBeCreate);
        }

        allFiles.push(destPath);
        allWriteStream.push(new Promise((streamResolve) => {
          entry
            .pipe(fs.createWriteStream(destPath))
            .on('finish', () => streamResolve())
            .on('close', () => streamResolve()); // resolve when file is empty in node v8
        }));
      })
      .on('end', () => {
        if (progressFunc) {
          progressFunc({
            percent: 1,
          });
        }

        Promise.all(allWriteStream)
          .then(() => resolve(allFiles))
          .catch(reject);
      });
  });
}

/**
 * 从 registry 获取 npm 的信息
 */
function getNpmInfo(npm: string, registry?: string): Promise<any> {
  const register = registry || getNpmRegistry(npm);
  const url = urlJoin(register, npm);

  return request.get(url).then((response) => {
    let body;
    try {
      body = JSON.parse(response);
    } catch (error) {
      return Promise.reject(error);
    }

    return body;
  });
}

/**
 * 获取某个 npm 的所有版本号
 */
function getVersions(npm: string, registry?: string): Promise<string[]> {
  return getNpmInfo(npm, registry).then((body: any) => {
    const versions = Object.keys(body.versions);
    return versions;
  });
}

/**
 * 根据指定 version 获取符合 semver 规范的最新版本号
 *
 * @param {String} baseVersion 指定的基准 version
 * @param {Array} versions
 */
function getLatestSemverVersion(baseVersion: string, versions: string[]): string {
  versions = versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => {
      return semver.gt(b, a);
    });
  return versions[0];
}

/**
 * 根据指定 version 和包名获取符合 semver 规范的最新版本号
 *
 * @param {String} npm 包名
 * @param {String} baseVersion 指定的基准 version
 */
function getNpmLatestSemverVersion(npm: string, baseVersion: string, registry?: string): Promise<string> {
  return getVersions(npm, registry).then((versions) => {
    return getLatestSemverVersion(baseVersion, versions);
  });
}

/**
 * 获取某个 npm 的最新版本号
 *
 * @param {String} npm
 */
function getLatestVersion(npm, registry?: string): Promise<string> {
  return getNpmInfo(npm, registry).then((data) => {
    if (!data['dist-tags'] || !data['dist-tags'].latest) {
      console.error('没有 latest 版本号', data);
      return Promise.reject(new Error('Error: 没有 latest 版本号'));
    }

    const latestVersion = data['dist-tags'].latest;
    return latestVersion;
  });
}

function isAliNpm(npmName?: string): boolean {
  return /^(@alife|@ali|@alipay|@kaola)\//.test(npmName);
}

function getNpmRegistry(npmName = ''): string {
  if (process.env.REGISTRY) {
    return process.env.REGISTRY;
  }

  if (isAliNpm(npmName)) {
    return 'https://registry.npm.alibaba-inc.com';
  }

  return 'https://registry.npm.taobao.org';
}

function getUnpkgHost(npmName = ''): string {
  if (process.env.UNPKG) {
    return process.env.UNPKG;
  }

  if (isAliNpm(npmName)) {
    return 'https://unpkg.alibaba-inc.com';
  }

  return 'https://unpkg.com';
}

function getNpmClient(npmName = ''): string {
  if (process.env.NPM_CLIENT) {
    return process.env.NPM_CLIENT;
  }

  if (isAliNpm(npmName)) {
    return 'tnpm';
  }

  return 'npm';
}

function checkAliInternal(): Promise<boolean> {
  return request({
    url: 'https://ice.alibaba-inc.com/check.node',
    timeout: 3 * 1000,
    resolveWithFullResponse: true,
  }).catch((err) => {
    console.debug('checkAliInternal error: ', err.message);
    return false;
  }).then((response) => {
    return response.statusCode === 200 && /success/.test(response.body);
  });
}

const packageJSONFilename = 'package.json';

async function readPackageJSON(projectPath: string) {
  const packagePath = path.join(projectPath, packageJSONFilename);
  const packagePathIsExist = await fsExtra.pathExists(packagePath);
  if (!packagePathIsExist) {
    throw new Error('Project\'s package.json file not found in local environment');
  }
  return await fsExtra.readJson(packagePath);
}

/**
 * 获取已安装在本地的模块版本号
 *
 * @param projectPath
 * @param packageName
 */
function getPackageLocalVersion(projectPath: string, packageName: string): string {
  const packageJsonPath = path.join(projectPath, 'node_modules', packageName, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version;
}

export {
  getLatestVersion,
  getNpmLatestSemverVersion,
  getNpmRegistry,
  getUnpkgHost,
  getNpmClient,
  isAliNpm,
  getNpmInfo,
  checkAliInternal,
  getNpmTarball,
  getAndExtractTarball,
  packageJSONFilename,
  readPackageJSON,
  getPackageLocalVersion,
};
