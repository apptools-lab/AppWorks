/**
 * 将 componentsMap 转换为数组
 * @param {*} componentsMap
 */
export default function transformComponentsMap(componentsMap) {
  const transformedComponentsMap = [];
  const excludeComponentKeys = ['Block', 'Page', 'Component', 'Div', 'A', 'Image', 'Text'];
  Object.keys(componentsMap).forEach((key) => {
    if (excludeComponentKeys.includes(key)) {
      return;
    }
    const componentMap = componentsMap[key];
    const { name, version, destructuring, exportName, subName, main } = componentMap;
    transformedComponentsMap.push({
      componentName: name,
      // package is a reserved word and it can't be in the destructuring assignment
      package: componentMap.package,
      version,
      destructuring,
      exportName,
      subName,
      main,
    });
  });

  return transformedComponentsMap;
}
