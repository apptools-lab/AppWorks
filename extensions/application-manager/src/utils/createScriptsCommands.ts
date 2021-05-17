import * as vscode from 'vscode';
import { createNpmCommand, checkPathExists, registerCommand } from '@appworks/common-service';
import { dependencyDir, projectPath } from '@appworks/project-service';
import openPreviewWebview from './preview/openPreviewWebview';
import showDefPublishEnvQuickPick from '../quickPicks/showDefPublishEnvQuickPick';
import runScript from '../terminal/runScript';

export default async function createScriptsCommands(context: vscode.ExtensionContext, recorder) {
  const EDITOR_MENU_RUN_DEBUG = 'applicationManager.scripts.runDebug';
  registerCommand(EDITOR_MENU_RUN_DEBUG, async () => {
    // Check dependences
    let scripts = createNpmCommand('run', 'start');
    if (!(await checkPathExists(projectPath, dependencyDir))) {
      scripts = `${createNpmCommand('install')} && ${scripts}`;
    }
    // npm run start.
    // Debug in VS Code move to appworks docs.
    runScript('Run Debug', projectPath, scripts);
    openPreviewWebview(context, recorder);
  });

  const EDITOR_MENU_RUN_BUILD = 'applicationManager.scripts.runBuild';
  registerCommand(EDITOR_MENU_RUN_BUILD, async () => {
    const pathExists = await checkPathExists(projectPath, dependencyDir);
    const title = 'Run Build';
    const npmBuildCommand = createNpmCommand('run', 'build');

    if (!pathExists) {
      const npmInstallCommand = createNpmCommand('install');
      runScript(title, projectPath, npmInstallCommand);
      runScript(title, projectPath, npmBuildCommand);
      return;
    }

    runScript(title, projectPath, npmBuildCommand);
  });

  registerCommand('applicationManager.scripts.DefPublish', () => {
    showDefPublishEnvQuickPick();
  });
}
