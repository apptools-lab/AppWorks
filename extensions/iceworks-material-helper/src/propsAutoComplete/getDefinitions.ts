import * as vscode from 'vscode';

export default async function getDefinitions(documentUri: string, position: vscode.Position): Promise<[]> {
  const { commands } = vscode;
  // https://code.visualstudio.com/api/references/commands
  const definitions: [] | undefined = await commands.executeCommand(
    'vscode.executeDefinitionProvider',
    documentUri,
    position,
  );

  return definitions || [];
}
