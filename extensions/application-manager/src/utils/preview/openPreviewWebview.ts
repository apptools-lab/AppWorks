import * as fs from 'fs-extra';
import * as path from 'path';
import * as vscode from 'vscode';
import { checkIsPegasusProject, getProjectFramework, projectPath } from '@appworks/project-service';
import { connectService, getHtmlForWebview } from '@appworks/connector/lib/vscode';
import { DEFAULT_START_URL, IDevServerStartInfo, getDevServerStartInfo } from '../getDevServerStartInfo';
import services from '../../services';

let previewWebviewPanel: vscode.WebviewPanel | undefined;

export default async function openPreview(context: vscode.ExtensionContext, recorder) {
  const { window } = vscode;
  const { extensionPath } = context;

  let startInfo: IDevServerStartInfo | undefined;

  const isPegasusProject = await checkIsPegasusProject();

  if (await getProjectFramework() === 'rax-app') {
    startInfo = await getDevServerStartInfo(projectPath, 4 * 60000);
  } else if (isPegasusProject) {
    // Set pegasus service url
    try {
      const abcConfigFile = path.join(projectPath, 'abc.json');
      if (fs.existsSync(abcConfigFile)) {
        const abcConfig = fs.readJSONSync(abcConfigFile);
        if (abcConfig.type === 'pegasus' && abcConfig.group && abcConfig.name) {
          setTimeout(() => {
            startInfo = { startUrl: `${DEFAULT_START_URL}${abcConfig.group}/${abcConfig.name}` };
          }, 10000);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (!startInfo) {
    return;
  }

  if (previewWebviewPanel) {
    previewWebviewPanel.reveal();
    return;
  }

  previewWebviewPanel = window.createWebviewPanel('appworks', 'Preview', vscode.ViewColumn.Two, {
    enableScripts: true,
    retainContextWhenHidden: true,
  });

  const extraHtml = `<script>window.__PREVIEW__DATA__ = ${JSON.stringify(startInfo || { startUrl: DEFAULT_START_URL })};</script>`;

  previewWebviewPanel.webview.html = getHtmlForWebview(extensionPath, 'preview', false, undefined, extraHtml);
  previewWebviewPanel.onDidDispose(
    () => {
      previewWebviewPanel = undefined;
    },
    null,
    context.subscriptions,
  );
  connectService(previewWebviewPanel, context, { services, recorder });
}
