import * as path from 'path';
import { scanDirectory } from './scanDirectory';
import { pagesPath, componentDirName } from './constant';

export interface IBlock {
  name: string;
  path: string;
}

export async function getBlocks(pageName: string): Promise<IBlock[]> {
  const blocksPath = path.join(path.join(pagesPath, pageName), componentDirName);
  let blockDirectroies = [];
  try {
    blockDirectroies = await scanDirectory(blocksPath);
  } catch (err) {
    // ignore error
  }

  const blocks = blockDirectroies.map((blockDir) => {
    return {
      name: blockDir,
      path: path.join(blocksPath, blockDir),
    };
  });
  return blocks;
}