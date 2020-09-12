import { bulkGenerate as originBulkGenerate } from '@iceworks/block-service';
import { componentsPath } from '@iceworks/project-service';

export const bulkGenerate = async function (blocks: any) {
  const result = await originBulkGenerate(blocks, componentsPath);
  return result;
};
