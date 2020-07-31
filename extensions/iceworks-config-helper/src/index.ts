import * as vscode from 'vscode';
import { getProjectFramework } from '@iceworks/project-service';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, Logger } from '@iceworks/common-service';
import services from './services/index';
import { loadJson, isBuildJson, updateJsonForWeb, updateJsonFile } from './loadJson';

async function activate() {
  try {
    const projectFramework = await getProjectFramework();

    vscode.extensions.all.forEach((extension) => {
      if (extension.id !== 'iceworks-team.iceworks-config-helper') {
        return;
      }

      const packageJSON = extension.packageJSON;
      if (packageJSON && packageJSON.contributes && (projectFramework === 'rax-app' || projectFramework === 'icejs')) {
        const jsonValidation = packageJSON.contributes.jsonValidation;
        jsonValidation[0].url = `./schemas/${projectFramework === 'icejs' ? 'ice' : 'rax'}.build.json`;
      }
    });
  } catch (e) {
    // ignore
  }
}
