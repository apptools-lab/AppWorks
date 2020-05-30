import { callService as originCallService } from '@iceworks/vscode-webview/lib/webview';

export default async function callService(service: string, method: string, ...args) {
  // @ts-ignore
  if (typeof acquireVsCodeApi === 'function') {
    originCallService.call(arguments);
  } else {
    return require(`./mocks/${service}/${method}`);
  }
}
