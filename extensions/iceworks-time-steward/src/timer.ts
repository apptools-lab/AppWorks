import * as vscode from 'vscode';
import * as fs from 'fs';
import * as request from 'request';
import { packageJson } from './typings/package';

export class Timer {
  private disposable: vscode.Disposable;

  private lastFile: string = 'null';

  private lastHeartbeat: number = 0;

  private extensionPath: string;

  private user = { account: '' };

  private options = { name: '', version: '' };

  constructor(extensionPath: string, user, options) {
    this.extensionPath = extensionPath;
    this.user = user;
    this.options = options;
  }

  public initialize(): void {
    console.info('initialize setupEventListeners');
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // subscribe to selection change and editor activation events
    const subscriptions: vscode.Disposable[] = [];
    // 监听光标位置变化
    vscode.window.onDidChangeTextEditorSelection(
      this.onChange,
      this,
      subscriptions
    );
    // 监听左侧文件树当前激活的文件变化
    vscode.window.onDidChangeActiveTextEditor(
      this.onChange,
      this,
      subscriptions
    );
    // 监听编辑器失去焦点的变化情况
    vscode.window.onDidChangeWindowState(this.onFocus, this, subscriptions);
    // 监听保存事件
    vscode.workspace.onDidSaveTextDocument(this.onSave, this, subscriptions);

    // create a combined disposable from both event subscriptions
    this.disposable = vscode.Disposable.from(...subscriptions);
    console.info('end=====');
  }

  public dispose() {
    this.disposable.dispose();
  }

  private onChange(): void {
    this.onEvent(false);
  }

  private onSave(): void {
    this.onEvent(true);
  }

  private onFocus(event: { focused: boolean }): void {
    if (!event.focused) {
      this.onEvent(true);
      this.lastHeartbeat = 0;
    }
  }

  private onEvent(isWrite: boolean): void {
    const editor = vscode.window.activeTextEditor;
    console.info('editor: ', editor);
    if (editor) {
      const doc = editor.document;
      console.info('doc: ', doc);
      if (doc) {
        const file: string = doc.fileName;
        console.info('file: ', file);
        console.info('lastHeartbeat: ', this.lastHeartbeat);
        if (file) {
          const time: number = Date.now();
          console.info(
            `isWrite:${isWrite} enoughTimePassed: ${this.enoughTimePassed(
              time
            )} lastFile: ${this.lastFile !== file}`
          );
          /**
           * 发送规则：
           * 1. 保存时必然发送
           * 2. 切换文件时必然发送
           * 3. 在同一个文件里面每隔2分钟发送一次
           */
          if (
            isWrite ||
            this.enoughTimePassed(time) ||
            this.lastFile !== file
          ) {
            console.info(`subTime: ${time - this.lastHeartbeat}`);
            const project = this.getProjectName(file);
            const subTime = time - this.lastHeartbeat;
            const account = this.user.account;
            if (this.lastHeartbeat !== 0) {
              const url = `http://gm.mmstat.com/efficiency.editor.codetime.vscode.editTime?user=${account}&timestamp=${subTime}&project=${project}&v=${this.options.version}`;
              console.info('sendUrl: ', url);
              request(url, (error) => {
                if (!error) {
                  console.info('===success===');
                } else {
                  console.error(`===error: ${error}===`);
                }
              });
            }

            this.lastFile = file;
            this.lastHeartbeat = time;
          }
        }
      }
    }
  }

  private enoughTimePassed(time: number): boolean {
    return this.lastHeartbeat + 120000 < time;
  }

  private getProjectName(file: string): string {
    const uri = vscode.Uri.file(file);
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
    console.log(workspaceFolder);
    if (vscode.workspace && workspaceFolder) {
      try {
        const packageJsonResultStr = fs.readFileSync(
          `${workspaceFolder.uri.path}/package.json`,
          'utf-8'
        );

        const packageJsonResultObj: packageJson = JSON.parse(
          packageJsonResultStr
        );
        return packageJsonResultObj.name;
      } catch (e) {
        console.error(e.message);
      }
      try {
        return workspaceFolder.name;
      } catch (e) {
        console.error(e.message);
      }
    }
    return '';
  }
}
