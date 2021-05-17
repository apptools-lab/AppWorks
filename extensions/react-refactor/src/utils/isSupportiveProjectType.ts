import { getProjectType } from '@appworks/project-service';
import { window } from 'vscode';
import { ProjectType } from '@appworks/project-utils';

async function isSupportiveProjectType() {
  const projectType: ProjectType = await getProjectType();
  const supportedProjectTypes = ['rax', 'react'];
  if (!supportedProjectTypes.includes(projectType)) {
    window.showErrorMessage(`Not support in ${projectType} project. Only support ${supportedProjectTypes.join(', ')} project.`);
    return false;
  }
  return true;
}

export default isSupportiveProjectType;
