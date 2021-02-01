import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

const packageJSONFilename = 'package.json';

export type ProjectType = 'unknown' | 'rax' | 'react' | 'vue';
export type ProjectFramework = 'unknown' | 'rax-app' | 'icejs' | 'component' | 'pegasus' | 'vue';

function processProjectType(projectPath: string): { type: ProjectType, version: string } {
  let type: ProjectType = 'unknown';
  let version = 'unknown';

  try {
    const packageJsonPath = join(projectPath, packageJSONFilename);
    const { dependencies = {} } = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' }));

    if (dependencies.rax) {
      type = 'rax';
      version = dependencies.rax;
    } else if (dependencies.react) {
      type = 'react';
      version = dependencies.react;
    } else if (dependencies.vue) {
      type = 'vue';
      version = dependencies.vue;
    }
  } catch (error) {
    console.error('process projectType error:', error);
  }

  return { type, version };
}

function processProjectFramework(projectPath: string): { framework: ProjectFramework, version: string } {
  let framework: ProjectFramework = 'unknown';
  let version = 'unknown';

  try {
    const packageJsonPath = join(projectPath, packageJSONFilename);
    const { dependencies = {}, devDependencies = {} } = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' }));

    if (devDependencies['rax-app'] || dependencies['rax-app']) {
      framework = 'rax-app';
      version = devDependencies['rax-app'] || dependencies['rax-app'];
    }
    if (devDependencies['ice.js'] || dependencies['ice.js']) {
      framework = 'icejs';
      version = devDependencies['ice.js'] || dependencies['ice.js'];
    }
    if (devDependencies['build-plugin-component']) {
      framework = 'component';
      version = devDependencies['build-plugin-component'];
    }
    if (devDependencies['@ali/build-plugin-pegasus-base']) {
      framework = 'pegasus';
      version = devDependencies['@ali/build-plugin-pegasus-base'];
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
  return processProjectType(projectPath).type;
}

export async function getProjectFramework(projectPath: string): Promise<ProjectFramework> {
  return processProjectFramework(projectPath).framework;
}

export function getProjectTypeAndVersionSync(projectPath: string): { type: ProjectType, version: string } {
  return processProjectType(projectPath);
}

export function getProjectFrameworkAndVersionSync(projectPath: string): { framework: ProjectFramework, version: string } {
  return processProjectFramework(projectPath);
}

export function getProjectLanguageTypeSync(projectPath: string): 'ts' | 'js' {
  const hasTsconfig = existsSync(join(projectPath, 'tsconfig.json'));

  const { framework, version } = getProjectFrameworkAndVersionSync(projectPath);
  let isTypescript = false;
  if (framework === 'icejs') {
    // icejs 都有 tsconfig，因此需要通过 src/app.js[x] 进一步区分
    const hasAppJs = existsSync(join(projectPath, 'src/app.js')) || existsSync(join(projectPath, 'src/app.jsx'));
    isTypescript = hasTsconfig && !hasAppJs;
  } else if (framework === 'rax-app' && version.indexOf('^3.') === 0) {
    // rax-app@3.x 都有 tsconfig，因此需要通过 src/app.js[x] 进一步区分
    const hasAppJs = existsSync(join(projectPath, 'src/app.js')) || existsSync(join(projectPath, 'src/app.jsx'));
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
