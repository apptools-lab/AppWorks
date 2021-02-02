import { join } from 'path';
import { exists, readFile } from 'fs';
import { promisify } from 'util';

const existsAsync = promisify(exists);
const readFileAsync = promisify(readFile);

const packageJSONFilename = 'package.json';

export type ProjectType = 'unknown' | 'rax' | 'react' | 'vue';
export type ProjectFramework = 'unknown' | 'rax-app' | 'icejs' | 'rax-component' | 'react-component' | 'pegasus-module' | 'vue';
export type ProjectLanguageType = 'ts' | 'js';
export type ProjectTypeInfo = { type: ProjectType, version: string };
export type ProjectFrameworkInfo = { framework: ProjectFramework, version: string };

async function getProjectTypeInfo(projectPath: string): Promise<ProjectTypeInfo> {
  let type: ProjectType = 'unknown';
  let version = 'unknown';

  try {
    const packageJsonPath = join(projectPath, packageJSONFilename);
    const { dependencies = {}, peerDependencies = {} } = JSON.parse(await readFileAsync(packageJsonPath, 'utf-8'));

    if (dependencies.rax || peerDependencies.rax) {
      type = 'rax';
      version = dependencies.rax || peerDependencies.rax;
    } else if (dependencies.react || peerDependencies.react) {
      type = 'react';
      version = dependencies.react || peerDependencies.react;
    } else if (dependencies.vue || peerDependencies.vue) {
      type = 'vue';
      version = dependencies.vue || peerDependencies.vue;
    }
  } catch (error) {
    console.error('process projectType error:', error);
  }

  return { type, version };
}

async function getProjectFrameworkInfo(projectPath: string): Promise<ProjectFrameworkInfo> {
  let framework: ProjectFramework = 'unknown';
  let version = 'unknown';

  try {
    const packageJsonPath = join(projectPath, packageJSONFilename);
    const { dependencies = {}, devDependencies = {} } = JSON.parse(await readFileAsync(packageJsonPath, 'utf-8'));

    if (devDependencies['rax-app'] || dependencies['rax-app']) {
      framework = 'rax-app';
      version = devDependencies['rax-app'] || dependencies['rax-app'];
    }
    if (devDependencies['ice.js'] || dependencies['ice.js']) {
      framework = 'icejs';
      version = devDependencies['ice.js'] || dependencies['ice.js'];
    }

    if (devDependencies['build-plugin-rax-component']) {
      framework = 'rax-component';
      version = devDependencies['build-plugin-rax-component'];
    }
    if (devDependencies['build-plugin-component']) {
      const buildJsonPath = join(projectPath, 'build.json');
      const buildConfig = await existsAsync(buildJsonPath) ? JSON.parse(await readFileAsync(buildJsonPath, 'utf-8')) : {};

      if (buildConfig.type === 'rax') {
        framework = 'rax-component';
        version = devDependencies['build-plugin-component'];
      } else {
        framework = 'react-component';
        version = devDependencies['build-plugin-component'];
      }
    }

    const abcJsonPath = join(projectPath, 'abc.json');
    if (await existsAsync(abcJsonPath) && devDependencies['@ali/build-plugin-pegasus-base']) {
      const abcConfig = JSON.parse(await readFileAsync(abcJsonPath, 'utf-8'));
      if (abcConfig.builder === '@ali/builder-pegasus') {
        framework = 'pegasus-module';
        version = devDependencies['@ali/build-plugin-pegasus-base'];
      }
    }
    if (dependencies.vue) {
      framework = 'vue';
      version = dependencies.vue;
    }
  } catch (error) {
    console.error('process projectFramework error:', error);
  }

  return { framework, version };
}

export async function getProjectType(projectPath: string): Promise<ProjectType> {
  const { type } = await getProjectTypeInfo(projectPath);
  return type;
}

export async function getProjectFramework(projectPath: string): Promise<ProjectFramework> {
  const { framework } = await getProjectFrameworkInfo(projectPath);
  return framework;
}

export async function getProjectTypeAndVersion(projectPath: string): Promise<ProjectTypeInfo> {
  return getProjectTypeInfo(projectPath);
}

export async function getProjectFrameworkAndVersionSync(projectPath: string): Promise<ProjectFrameworkInfo> {
  return getProjectFrameworkInfo(projectPath);
}

export async function getProjectLanguageTypeSync(projectPath: string): Promise<ProjectLanguageType> {
  const hasTsconfig = await existsAsync(join(projectPath, 'tsconfig.json'));

  const { framework, version } = await getProjectFrameworkAndVersionSync(projectPath);
  let isTypescript = false;
  if (framework === 'icejs') {
    // icejs 都有 tsconfig，因此需要通过 src/app.js[x] 进一步区分
    const hasAppJs = await existsAsync(join(projectPath, 'src/app.js')) || await existsAsync(join(projectPath, 'src/app.jsx'));
    isTypescript = hasTsconfig && !hasAppJs;
  } else if (framework === 'rax-app' && version.indexOf('^3.') === 0) {
    // rax-app@3.x 都有 tsconfig，因此需要通过 src/app.js[x] 进一步区分
    const hasAppJs = await existsAsync(join(projectPath, 'src/app.js')) || await existsAsync(join(projectPath, 'src/app.jsx'));
    isTypescript = hasTsconfig && !hasAppJs;
  } else {
    isTypescript = hasTsconfig;
  }

  return isTypescript ? 'ts' : 'js';
}

export async function checkIsTargetProjectType(projectPath: string): Promise<boolean> {
  return (await getProjectType(projectPath)) !== 'unknown';
}

export async function checkIsTargetProjectFramework(projectPath: string): Promise<boolean> {
  return (await getProjectFramework(projectPath)) !== 'unknown';
}
