import { block } from '@appworks/material-engine';
import { componentsPath, getFolderPath, getProjectType } from '@appworks/project-service';

const { bulkGenerate: originBulkGenerate, renderBlocks, addBlockCode, insertBlock } = block;

export const bulkGenerate = async function (blocks: any) {
  const projectType = await getProjectType();

  let outputPath = componentsPath;

  if (projectType === 'unknown') {
    // select folder path
    outputPath = await getFolderPath();
  }
  const result = await originBulkGenerate(blocks, outputPath);
  return result;
};

export { renderBlocks, addBlockCode, insertBlock };
