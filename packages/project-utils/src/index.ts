import { readFile } from 'jsonfile';
import { join } from 'path';

export type ProjectType = 'unknown'|'rax'|'react'|'vue';

export async function getProjectType(projectPath: string): Promise<ProjectType> {
  let type: ProjectType = 'unknown';
  try {
    const packageJsonPath = join(projectPath, 'package.json');
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

export async function checkIsTargetProject(projectPath: string): Promise<boolean> {
  return (await getProjectType(projectPath)) !== 'unknown';
}
