import * as startcase from 'lodash.startcase';

/**
 * format block or component name. e.g. @ali/example-block -> AliExampleBlock
 * @param material
 */
export default function formatMaterialName(materialName) {
  return startcase(materialName).replace(/\s+/g, '');
}
