import * as vscode from 'vscode';
import * as path from 'path';
import getFilenameWithoutExtname from '../getFilenameWithoutExtname';
import getCompletionItem from '../getCompletionItem';


/**
 * check the file is layouts or pages directory
 * @param fileType;
 * @param filename;
 */
function checkValidateOfIsDirectory([filename, fileType]: [string, vscode.FileType]): boolean {
  return fileType === vscode.FileType.Directory && ['layouts', 'pages'].includes(filename);
}

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
    const importSourceValue = `./${directoryName}/${filenameWithoutExtname}`;
    if (!alreadyImportSet.has(path.join(importSourceValue))) {
      items.push(getCompletionItem(importSourceValue));
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
    const filename = file[0];
    if (checkValidateOfIsDirectory(file)) {
      items.push(...await getItemsFromDirectory(path.resolve(filePath, filename), filename, alreadyImportSet));
    }
  }

  return items;
};
