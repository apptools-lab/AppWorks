/* eslint-disable no-undef */

// @ts-ignore
const vscode = (window as any).isVscode ? acquireVsCodeApi() : null;

export default async function callService(service: string, method: string, ...args) {
  return new Promise((resolve, reject) => {
    const eventId = setTimeout(() => {});
    console.log('webview call vscode service', service, method, eventId, args);

    const handler = (event) => {
      const message = event.data;
      console.log('webview receive vscode message', message);
      if (message.eventId === eventId) {
        window.removeEventListener('message', handler);
        message.errorMessage ? reject(new Error(message.errorMessage)) : resolve(message.result);
      }
    };
    window.addEventListener('message', handler);

    vscode.postMessage({
      service,
      method,
      eventId,
      args,
    });
  });
}

