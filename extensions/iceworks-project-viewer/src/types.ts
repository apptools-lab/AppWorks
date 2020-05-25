import { Terminal } from "vscode";

export type ITerminalMap = Map<string, Terminal>;

export type NodeDepTypes = 'dependencies' | 'devDependencies';

export interface Command {
  command: string;
  title: string;
  arguments: any[]
}
