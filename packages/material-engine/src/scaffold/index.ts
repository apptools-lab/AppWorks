import * as vscode from 'vscode';
import axios from 'axios';

export function getScaffoldResources(): Array<Record<string, unknown>> {
  const materialSources = vscode.workspace.getConfiguration('iceworks').get('materialSources', []);
  return materialSources;
}

export async function getScaffolds(source: string) {
  const response = await axios.get(source);
  return response.data.scaffolds;
}
