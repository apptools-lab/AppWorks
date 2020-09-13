import * as vscode from 'vscode';
import * as fs from 'fs';
import * as request from 'request';
import { packageJson } from './typings/package';

export class Timer {
  private disposable: vscode.Disposable;

  private lastFile: string = '';

  private lastHeartbeat: number = 0;

  private user = { account: '' };

  private options = { name: '', version: '' };

  constructor(user, options) {
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
    vscode.window.onDidChangeTextEditorSelection(this.onChange, this, subscriptions);
    // 监听左侧文件树当前激活的文件变化
    vscode.window.onDidChangeActiveTextEditor(this.onChange, this, subscriptions);
    // 监听保存事件
    vscode.workspace.onDidSaveTextDocument(this.onSave, this, subscriptions);
    // 监听编辑器失去焦点的变化情况
    vscode.window.onDidChangeWindowState(this.onFocus, this, subscriptions);

    // create a combined disposable from both event subscriptions
    this.disposable = vscode.Disposable.from(...subscriptions);
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
    if (editor) {
      const doc = editor.document;
      if (doc) {
        const file: string = doc.fileName;
        if (file) {
          const time: number = Date.now();
          const enoughTimePassed = this.enoughTimePassed(time);
          console.info(
            `isWrite:${isWrite}; enoughTimePassed: ${enoughTimePassed}; lastFile: ${this.lastFile}`
          );
          /**
           * 发送规则：
           * 1. 保存时必然发送
           * 2. 切换文件时必然发送
           * 3. 在同一个文件里面每隔2分钟发送一次
           */
          if (
            isWrite ||
            enoughTimePassed ||
            this.lastFile !== file
          ) {
            const project = this.getProjectName(file);
            const subTime = time - this.lastHeartbeat;
            const account = this.user.account;
            if (this.lastHeartbeat !== 0) {
              const url = `http://gm.mmstat.com/efficiency.editor.codetime.vscode.editTime?user=${account}&timestamp=${subTime}&project=${project}&v=${this.options.version}`;
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
    if (workspaceFolder) {
      try {
        const packageJsonResultObj: packageJson = JSON.parse(fs.readFileSync(`${workspaceFolder.uri.path}/package.json`, 'utf-8'));
        return packageJsonResultObj.name;
      } catch (e) {
        console.error(e.message);
      }
      return workspaceFolder.name;
    }
    return '';
  }
}
