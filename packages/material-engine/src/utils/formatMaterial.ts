import * as startcase from 'lodash.startcase';

/**
 * format block or component name. e.g. @ali/example-block -> AliExampleBlock
 * @param material
 */
export default function formatMaterial(material) {
  material.name = startcase(material.name).replace(/\s+/g, '');
  return material;
}
