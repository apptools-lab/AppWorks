declare const acquireVsCodeApi: any;

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
interface IVScode {
  postMessage(message: any): void;
}

declare const vscode: IVScode;
