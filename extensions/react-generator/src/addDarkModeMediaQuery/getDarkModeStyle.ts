import * as gonzales from 'gonzales-pe';
import isColor from './isColor';
import transformColor from './transformColor';

const MAX_NEST_LEVEL = 3;

function removeAfterSpace(index, parent) {
  if (parent.get(index) && parent.get(index).is('space')) {
    parent.removeChild(index);
  }
}

function isEmptyBlock(node) {
  if (!node) {
    return true;
  }
  let spacesCount = 0;
  node.traverseByType('space', () => {
    spacesCount++;
  });
  return node.length === 0 || node.length === spacesCount;
}

function removeEmptyRuleset(targetNode) {
  targetNode.eachFor((node, index, parent) => {
    if (node.is('ruleset')) {
      const block = node.first('block');
      if (isEmptyBlock(block)) {
        parent.removeChild(index);
        removeAfterSpace(index, parent);
      } else {
        removeEmptyRuleset(block);
      }
    } else if (node.is('space') && parent.is('block')) {
      parent.removeChild(index);
    }
  });
}

export default function getDarkModeStyle(css: string, syntax: string): string {
  const parseTree = gonzales.parse(css, { syntax });

  parseTree.traverseByTypes(['atrule', 'declarationDelimiter'], (node, index, parent) => {
    parent.removeChild(index);
  });

  parseTree.traverseByType('declaration', (node, index, parent) => {
    let hasColor = false;
    const value = node.content.find((item) => item.type === 'value');

    for (let i = 0; i < value.content.length; i++) {
      // Update color to data mode
      const item = value.content[i];
      if (item.type === 'color' || isColor(item.content)) {
        hasColor = true;
        item.content = transformColor(item.type === 'color' ? `#${item.content}` : item.content);
        item.type = 'ident';
      }
    }

    if (!hasColor) {
      parent.removeChild(index);
    } else {
      parent.insert(index + 1, gonzales.createNode({ type: 'declarationDelimiter', content: ';' }));
    }
  });

  for (let i = 0; i < MAX_NEST_LEVEL; i++) {
    removeEmptyRuleset(parseTree);
  }

  return parseTree.toString();
}
