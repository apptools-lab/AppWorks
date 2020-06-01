const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;

export default async function callService(command: string, ...args: any[]) {
  return vscode ?
    new Promise((resolve, reject) => {
      function listener(event) {
        const message = event.data;
        if (message.command === command) {
          window.removeEventListener('message', listener);
          message.error ? reject(new Error(message.error)) : resolve(message.res);
        }
      }

      window.addEventListener('message', listener);
      vscode.postMessage({
        command,
        args
      });
    }) :
    undefined;
}