function handleValidIdentifier(identifierPath, callback) {
  if (identifierPath.parent) {
    switch (identifierPath.parent.type) {
      case 'ObjectProperty':
        if (identifierPath.parent.key !== identifierPath.node) {
          callback();
        }
        break;
      case 'MemberExpression':
      // For list[index]
        if (identifierPath.parent.computed) {
          callback();
        } else if (identifierPath.parent.property !== identifierPath.node) {
          callback();
        }
        break;
      default:
        callback();
    }
  }
}

export default handleValidIdentifier;
