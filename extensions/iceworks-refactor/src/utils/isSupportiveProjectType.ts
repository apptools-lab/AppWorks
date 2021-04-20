import { getProjectType } from '@iceworks/project-service';
import { window } from 'vscode';
import { ProjectType } from '@iceworks/project-utils';

async function isSupportiveProjectType() {
  const projectType: ProjectType = await getProjectType();
  const supportedProjectTypes = ['rax', 'react'];
  if (!supportedProjectTypes.includes(projectType)) {
    window.showErrorMessage(`iceworks-refactor: Not support in ${projectType} project. Only support ${supportedProjectTypes.join(', ')} project.`);
    return false;
  }
  return true;
}

export default isSupportiveProjectType;
