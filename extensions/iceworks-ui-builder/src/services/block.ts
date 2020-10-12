import { bulkGenerate as originBulkGenerate } from '@iceworks/material-engine/lib/block';
import { componentsPath, getFolderPath, getProjectType } from '@iceworks/project-service';

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
