import * as path from 'path';
import docsUrl from '../docsUrl';

const RULE_NAME = 'no-js-in-ts-project';

const TS_REG = /\.tsx?$/;
const JS_REG = /\.jsx?$/;

let isTSProject = false;

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
      noJSInTSProject: "The '{{fileName}}' is not recommended in TS project",
    },
  },

  create(context) {
    const fileName = context.getFilename();
    const extName = path.extname(fileName);
    if (TS_REG.test(extName)) {
      isTSProject = true;
    }

    if (isTSProject && JS_REG.test(extName)) {
      context.report({
        loc: {
          start: {
            line: 0,
            column: 0,
          },
          end: {
            line: 0,
            column: 0,
          },
        },
        messageId: 'noJSInTSProject',
        data: {
          fileName,
        },
      });
    }

    // Necessary
    return {};
  },
};
