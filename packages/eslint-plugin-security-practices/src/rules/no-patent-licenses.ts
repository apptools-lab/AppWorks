import * as path from 'path';
import * as fs from 'fs-extra';
import docsUrl from '../docsUrl';

const RULE_NAME = 'no-patent-licenses';

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
      noPatentLicenses: "The package '{{dependencyName}}' with license '{{license}}' may cause some problem.",
    },
  },

  create(context) {
    if (path.basename(context.getFilename()) !== 'package.json') {
      return {};
    }

    const cwd = context.getCwd();

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
              const dependencyPackageFile = path.join(cwd, 'node_modules', dependencyName, 'package.json');
              if (fs.existsSync(dependencyPackageFile)) {
                const dependencyPackage = fs.readJSONSync(dependencyPackageFile);
                const license = dependencyPackage.license || '';
                // https://spdx.org/licenses/
                if (license.indexOf('Patent') > -1) {
                  context.report({
                    loc: property.loc,
                    messageId: 'noPatentLicenses',
                    data: {
                      dependencyName,
                      license,
                    },
                  });
                }
              }
            }
          });
        }
      },
    };
  },
};
