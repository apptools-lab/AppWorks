import * as vscode from 'vscode';

export function openInExternalBrowser(url) {
  vscode.env.openExternal(url);
}

export function openInInternalBrowser(url: string) {
  // TODO: use iframe or browser-preview
  // console.log('openUrl',url);
  // const config = vscode.workspace.getConfiguration('browser-preview');
  // const oldURL = config.get('startUrl');
  // config.update('startUrl',`${url}`,vscode.ConfigurationTarget.Global);
  // const extension = vscode.extensions.getExtension('vscode-browser-preview');
  // console.log(config)
  // vscode.commands.executeCommand('browser-preview.openPreview');
  // config.update('startUrl',oldURL);
  // const docPanel = vscode.window.createWebviewPanel('iceworks','iceworks-查找文档',vscode.ViewColumn.Two);
  // docPanel.webview.html=`
  // <!DOCTYPE html>
  // <html>
  //     <head>
  //         <meta charset="utf-8">
  //         <title></title>
  //     </head>
  //     <body>
  //         <iframe border="0px" src="https://ice.work/component/input" width="100%" height="1080px"></iframe>
  //     </body>
  //     <style>
  //         body{
  //             background-color: white;
  //         }
  //     </style>
  // </html>
  // `;
}
