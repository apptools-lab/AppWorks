import * as vscode from 'vscode';
import { getProjectFramework } from '@iceworks/project-service';

async function activate() {

  try {
    const projectFramework = await getProjectFramework();

    vscode.extensions.all.forEach(extension => {
      if (extension.id !== 'iceworks-team.iceworks-config-helper') {
        return;
      }

      const packageJSON = extension.packageJSON;
      if (
        packageJSON && packageJSON.contributes &&
        (projectFramework === 'rax-app' || projectFramework === 'icejs')
      ) {
        const jsonValidation = packageJSON.contributes.jsonValidation;
        jsonValidation[0].url = `./schemas/${projectFramework === 'icejs' ? 'ice' : 'rax'}.build.json`;
      }
    });
  } catch (e) {
    // ignore
  }
};

exports.activate = activate;
