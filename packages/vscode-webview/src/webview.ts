// @ts-ignore
// eslint-disable-next-line
export const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;

export const callService = function (service: string, method: string, ...args) {
  return new Promise((resolve, reject) => {
    const eventId = setTimeout(() => {});
    console.log('webview call vscode service:', service, method, eventId, args);

    const handler = (event) => {
      const message = event.data;
      console.log('webview receive vscode message:', message.eventId);
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
};
