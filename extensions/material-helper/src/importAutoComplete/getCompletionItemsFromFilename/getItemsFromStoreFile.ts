import * as vscode from 'vscode';
import { getProjectFramework } from '@appworks/project-service';
import getFilenameWithoutExtname from '../getFilenameWithoutExtname';
import getCompletionItem from '../getCompletionItem';

export default async (
  filePath: string,
  alreadyImportSet: Set<string>,
): Promise<vscode.CompletionItem[]> => {
  const items: vscode.CompletionItem[] = [];
  try {
    if (['icejs', 'rax-app'].includes(await getProjectFramework())) {
      const modelsDirectoryUri = vscode.Uri.parse(filePath);
      const files = await vscode.workspace.fs.readDirectory(modelsDirectoryUri);
      for (const file of files) {
        if (!alreadyImportSet.has(file[0])) {
          items.push(getCompletionItem(`./models/${getFilenameWithoutExtname(file[0])}`));
        }
      }
    }
  } catch (e) {
    console.error(e);
    // ignore
  }
  return items;
};
