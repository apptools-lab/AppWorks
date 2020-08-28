import * as path from 'path';
import docsUrl from '../docsUrl';

const RULE_NAME = 'deps-no-resolutions';

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      url: docsUrl(RULE_NAME),
    },
    fixable: null,
    messages: {
      // eslint-disable-next-line
      depsNoResolutions: 'It is not recommended to use resolutions to lock the version',
    },
  },

  create(context) {
    if (path.basename(context.getFilename()) !== 'package.json') {
      return {};
    }
    return {
      Property: function handleRequires(node: any) {
        if (node.key && node.key.value && node.key.value === 'resolutions') {
          context.report({
            node,
            messageId: 'depsNoResolutions',
          });
        }
      },
    };
  },
};
