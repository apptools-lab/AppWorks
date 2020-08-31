import * as path from 'path';
import docsUrl from '../docsUrl';

const RULE_NAME = 'deps-no-router-library';

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      url: docsUrl(RULE_NAME),
    },
    fixable: null, // or "code" or "whitespace"
    messages: {
      // eslint-disable-next-line
      depsNoRouterLibrary: 'It is not recommended to directly rely on routing libraries "{{name}}"',
    },
  },

  create(context) {
    if (path.basename(context.getFilename()) !== 'package.json') {
      return {};
    }

    const routerLibs = ['react-router', 'vue-router', 'rax-use-router'];

    return {
      Property: function handleRequires(node: any) {
        if (
          node.key &&
          node.key.value &&
          (node.key.value === 'dependencies' || node.key.value === 'devDependencies') &&
          node.value &&
          node.value.properties
        ) {
          node.value.properties.forEach((property) => {
            if (property.key && property.key.value) {
              const dependencyName = property.key.value;
              const routerLib = routerLibs.find((lib) => dependencyName === lib);

              if (routerLib) {
                context.report({
                  loc: property.loc,
                  messageId: 'depsNoRouterLibrary',
                  data: {
                    name: routerLib,
                  },
                });
              }
            }
          });
        }
      },
    };
  },
};
