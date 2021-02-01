import { join } from 'path';
import { readFile, readFileSync, existsSync } from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

const packageJSONFilename = 'package.json';

export type ProjectType = 'unknown' | 'rax' | 'react' | 'vue';
export type ProjectFramework = 'unknown' | 'rax-app' | 'icejs' | 'vue';

export async function getProjectType(projectPath: string): Promise<ProjectType> {
  let type: ProjectType = 'unknown';
  try {
    const packageJsonPath = join(projectPath, packageJSONFilename);
    const { dependencies = {} } = JSON.parse(await readFileAsync(packageJsonPath, 'utf-8'));
    if (dependencies.rax) {
      type = 'rax';
    }
    if (dependencies.react) {
      type = 'react';
    }
    if (dependencies.vue) {
      type = 'vue';
    }
  } catch (error) {
    console.error('read packageJson error:', error);
  }
  return type;
}

export async function getProjectFramework(projectPath: string): Promise<ProjectFramework> {
  let framework: ProjectFramework = 'unknown';
  try {
    const packageJsonPath = join(projectPath, packageJSONFilename);
    const packageJson = JSON.parse(await readFileAsync(packageJsonPath, 'utf-8'));
    const { dependencies = {}, devDependencies = {} } = packageJson;
    if (devDependencies['rax-app'] || dependencies['rax-app']) {
      framework = 'rax-app';
    }
    if (devDependencies['ice.js'] || dependencies['ice.js']) {
      framework = 'icejs';
    }
    if (dependencies.vue) {
      framework = 'vue';
    }
  } catch (error) {
    // ignore errors
    console.error('read packageJson error:', error);
  }

  return framework;
}

export function getProjectFrameworkAndVersionSync(projectPath: string): { framework: ProjectFramework, version: string } {
  let framework: ProjectFramework = 'unknown';
  let version = 'unknown';
  const packageJsonPath = join(projectPath, 'package.json');
  try {
    const { dependencies = {}, devDependencies = {} } = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' }));
    if (devDependencies['rax-app'] || dependencies['rax-app']) {
      framework = 'rax-app';
      version = devDependencies['rax-app'] || dependencies['rax-app'];
    }
    if (devDependencies['ice.js'] || dependencies['ice.js']) {
      framework = 'icejs';
      version = devDependencies['ice.js'] || dependencies['ice.js'];
    }
    if (dependencies.vue) {
      framework = 'vue';
      version = dependencies.vue;
    }
  } catch (error) {
    // ignore errors
    console.error('getProjectFrameworkAndVersionSync error:', error);
  }

  return { framework, version };
}

export function getProjectTypeAndVersionSync(projectPath: string): { type: ProjectType, version: string } {
  let type: ProjectType = 'unknown';
  let version = 'unknown';
  const packageJsonPath = join(projectPath, 'package.json');
  try {
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
    // ignore error
    console.error('getProjectType error:', error);
  }

  return { type, version };
}

export function getProjectLanguageTypeSync(projectPath: string): 'ts' | 'js' {
  const hasTsconfig = existsSync(join(projectPath, 'tsconfig.json'));

  const { framework } = getProjectFrameworkAndVersionSync(projectPath);
  let isTypescript = false;
  if (framework === 'icejs') {
    // icejs 都有 tsconfig，因此需要通过 src/app.js[x] 进一步区分
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
