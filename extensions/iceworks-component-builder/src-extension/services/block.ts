import { bulkCreate as originBulckCreate } from '@iceworks/block-service';
import { componentsPath } from '@iceworks/project-service';

export const bulkGenerate = async function(blocks: any) {
  return await originBulckCreate(blocks, componentsPath);
}
