/* eslint-disable */
import { callService as originCallService } from '@iceworks/vscode-webview/lib/webview';

export default async function callService(service: string, method: string, ...args) {
  // @ts-ignore
  if (typeof acquireVsCodeApi === 'function') {
    return await originCallService.apply(null, arguments);
  } else {
    console.log(require(`../mocks/${service}/${method}`));
    return require(`../mocks/${service}/${method}`) || require(`../mocks/${service}/${method}`).default;
  }
}
