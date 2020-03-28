// const vscode = acquireVsCodeApi();
// vscode.postMessage({
//   command: 'alert',
//   text: '哈哈哈'
// })

import { createApp } from 'ice';

const appConfig = {
  app: {
    rootId: 'ice-container',
  },
};

createApp(appConfig);
