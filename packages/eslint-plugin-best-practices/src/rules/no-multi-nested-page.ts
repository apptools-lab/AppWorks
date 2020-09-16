import docsUrl from '../docsUrl';

const RULE_NAME = 'no-multi-nested-page';

const COUNT_CACHE = {};
const NESTED_TAGS = ['web', 'iframe', 'embed', 'web-view', 'Embed'];

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
      noMultiNestedPage: 'Multiple nested pages are not recommended',
    },
  },

  create(context) {
    const fileName = context.getFilename();

    COUNT_CACHE[fileName] = 0;
    return {
      JSXOpeningElement: function handleRequires(node: any) {
        if (node.name && node.name.name && NESTED_TAGS.find((tag) => tag === node.name.name)) {
          COUNT_CACHE[fileName]++;
        }
        // report
        if (COUNT_CACHE[fileName] > 1) {
          context.report({
            node,
            messageId: 'noMultiNestedPage',
          });
        }
      },
    };
  },
};
