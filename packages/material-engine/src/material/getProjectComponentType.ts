import * as path from 'path';
import * as fse from 'fs-extra';
import {
  projectPath,
  packageJSONFilename,
} from '@appworks/project-service';

const packageJSONPath = path.join(projectPath, packageJSONFilename);
const componentType = {
  '@alifd/next': 'fusion',
  '@alife/next': 'fusion',
  '@icedesign/base': 'fusion',
  antd: 'antd',
  '@alifd/meet': 'fusion-mobile',
};

export function getProjectComponentType() {
  if (!fse.pathExistsSync(packageJSONPath)) {
    return '';
  }

  const { dependencies = {}, devDependencies = {}, peerDependencies = {} } = fse.readJsonSync(packageJSONPath);
  const deps = Object.assign(dependencies, devDependencies, peerDependencies);
  const componentName = Object.keys(componentType).find((key: string) => {
    return deps[key];
  });

  return componentType[componentName] || '';
}
