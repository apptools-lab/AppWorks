/* eslint-disable dot-notation */
import * as vscode from 'vscode';
import { openInExternalBrowser, openInInternalBrowser } from './openInBowser';
import { getSource } from '../utils/sourceManager';

export default async function showMaterialQuickPicks() {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = await getSource('quickPickInfo');
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      openInInternalBrowser(selection[0]['homepage']);
      quickPick.dispose();
    }
  });
  quickPick.show();
}
