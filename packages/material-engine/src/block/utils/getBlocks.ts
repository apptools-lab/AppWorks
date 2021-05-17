import * as path from 'path';
import { pagesPath, COMPONENT_DIR_NAME } from '@appworks/project-service';
import { scanDirectory } from './scanDirectory';

export interface IBlock {
  name: string;
  path: string;
}

export async function getBlocks(pageName: string): Promise<IBlock[]> {
  const blocksPath = path.join(path.join(pagesPath, pageName), COMPONENT_DIR_NAME);
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
