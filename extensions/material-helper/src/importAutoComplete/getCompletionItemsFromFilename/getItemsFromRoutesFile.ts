import * as vscode from 'vscode';
import * as path from 'path';
import getFilenameWithoutExtname from '../getFilenameWithoutExtname';
import getCompletionItem from '../getCompletionItem';

async function getItemsFromDirectory(
  directoryPath: string,
  directoryName: string,
  alreadyImportSet: Set<string>,
): Promise<vscode.CompletionItem[]> {
  const items: vscode.CompletionItem[] = [];
  const uri = vscode.Uri.parse(directoryPath);
  const files = await vscode.workspace.fs.readDirectory(uri);
  for (const file of files) {
    const filenameWithoutExtname = getFilenameWithoutExtname(file[0]);
    if (!alreadyImportSet.has(filenameWithoutExtname)) {
      items.push(getCompletionItem(`./${directoryName}/${filenameWithoutExtname}`));
    }
  }
  return items;
}


export default async (
  filePath: string,
  alreadyImportSet: Set<string>,
): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  const uri = vscode.Uri.parse(filePath);
  const files = await vscode.workspace.fs.readDirectory(uri);
  for (const file of files) {
    const [filename, fileType] = [file[0], file[1]];
    if (fileType === vscode.FileType.Directory && ['layouts', 'pages'].includes(filename)) {
      items.push(...await getItemsFromDirectory(path.resolve(filePath, filename), filename, alreadyImportSet));
    }
  }

  return items;
};
