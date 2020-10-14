/**
 * 转换 componentsTree 中的 Text 组件
 * eg: <Text text='test' /> --> <Text>test</Text>
 * @param componentsTree
 */
export default function transformTextComponent(componentsTree) {
  if (!componentsTree.children || !(componentsTree.children instanceof Array)) {
    return;
  }
  componentsTree.children.forEach((item) => {
    if (item.componentName === 'Text') {
      item.children = item.props.text;
      delete item.props.text;
    }
    return transformTextComponent(item);
  });

  return componentsTree;
}
