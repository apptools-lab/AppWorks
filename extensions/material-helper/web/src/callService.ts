/* eslint-disable */
import { callService as originCallService } from '@appworks/connector/lib/webview';

export default async function callService(service: string, method: string, ...args) {
  // @ts-ignore
  if (typeof acquireVsCodeApi === 'function') {
    return await originCallService.apply(null, arguments);
  } else {
    return require(`../mocks/${service}/${method}`);
  }
}
