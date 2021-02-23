import * as upperCamelCase from 'uppercamelcase';
import { getBlocks } from './getBlocks';
import formatMaterialName from '../../utils/formatMaterialName';

export async function generateBlockName(pageName: string, defineName: string): Promise<string> {
  const blocks = await getBlocks(pageName);

  function generateName(value, count = 0) {
    const setName = formatMaterialName(value);
    const newName = !count ? setName : `${setName}${count}`;
    const isConflict = blocks.some(({ name }) => upperCamelCase(name) === newName);
    if (isConflict) {
      return generateName(setName, count + 1);
    }
    return newName;
  }

  return generateName(defineName);
}
