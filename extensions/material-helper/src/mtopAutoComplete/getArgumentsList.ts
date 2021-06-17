import { Identifier, CallExpression, isObjectExpression, ObjectExpression, isObjectProperty } from '@babel/types';


function getObjectPropertiesKey(node: ObjectExpression): string[] {
  const items: string[] = [];
  const { properties } = node;
  properties.forEach(property => {
    if (isObjectProperty(property)) {
      const { key } = property;
      items.push((key as Identifier).name);
    }
  });
  return items;
}

/**
 * 获得对象参数列表
 * @param objectExpression
 */
export default function getArgumentsList(callExpression: CallExpression): string[] {
  const objectExpress = callExpression.arguments?.[0];
  if (isObjectExpression(objectExpress)) {
    return getObjectPropertiesKey(objectExpress);
  }
  return [];
}

