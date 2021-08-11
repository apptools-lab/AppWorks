import * as fs from 'fs';
import { commands, Uri } from 'vscode';
import JsonToTS from 'json-to-ts';
import recorder from '../recorder';

export default function jsonToTsInterface(uri: Uri) {
  recorder.record({
    module: 'generator',
    action: 'jsonToTsInterface',
  });

  const { fsPath } = uri;
  const json = fs.readFileSync(fsPath, 'utf-8');
  const interfaces = JsonToTS(JSON.parse(json));
  const filePath = `${fsPath}.ts`;

  fs.writeFileSync(filePath, interfaces.join('\n\n'));
  commands.executeCommand('vscode.open', Uri.file(filePath));
}
