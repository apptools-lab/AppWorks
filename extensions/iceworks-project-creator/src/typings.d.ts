declare const acquireVsCodeApi: any;

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
interface VScode {
  postMessage(message: any): void;
}

declare const vscode: VScode;