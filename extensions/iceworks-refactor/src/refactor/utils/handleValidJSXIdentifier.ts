
function handleValidJSXIdentifier(identifierPath, callback) {
  switch (identifierPath.parent.type) {
    case 'ObjectProperty':
      if (identifierPath.parent.key !== identifierPath.node) {
        callback();
      }
      break;
    case 'JSXMemberExpression':
      if (identifierPath.parent.property !== identifierPath.node) {
        callback();
      }
      break;
    default:
      callback();
  }
}

export default handleValidJSXIdentifier;
