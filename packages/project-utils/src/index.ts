import { readFile } from 'jsonfile';
import { join } from 'path';

const packageJSONFilename = 'package.json';

export type ProjectType = 'unknown'|'rax'|'react'|'vue';
export type ProjectFramework = 'unknown'|'rax-app'|'icejs'|'vue';

export async function getProjectType(projectPath: string): Promise<ProjectType> {
  let type: ProjectType = 'unknown';
  try {
    const packageJsonPath = join(projectPath, packageJSONFilename);
    const { dependencies = {} } = await readFile(packageJsonPath);
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
    // ignore error
  }
  return type;
}

export async function getProjectFramework(projectPath: string): Promise<ProjectFramework> {
  let framework: ProjectFramework = 'unknown';
  try {
    const packageJsonPath = join(projectPath, packageJSONFilename);
    const { dependencies = {}, devDependencies = {} } = await readFile(packageJsonPath);
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
  }

  return framework;
}

export async function checkIsTargetProjectType(projectPath: string): Promise<boolean> {
  return (await getProjectType(projectPath)) !== 'unknown';
}

export async function checkIsTargetProjectFramework(projectPath: string): Promise<boolean> {
  return (await getProjectFramework(projectPath)) !== 'unknown';
}
