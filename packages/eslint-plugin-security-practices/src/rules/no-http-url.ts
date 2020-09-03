import docsUrl from '../docsUrl';

const RULE_NAME = 'no-http-url';

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      url: docsUrl(RULE_NAME),
    },
    fixable: 'code',
    messages: {
      // eslint-disable-next-line
      noHttpUrl: "Recommended '{{url}}' switch to HTTPS",
    },
  },
  create(context: any) {
    return {
      Literal: function handleRequires(node: any) {
        if (node.value && typeof node.value === 'string' && node.value.indexOf('http:') === 0) {
          context.report({
            node,
            messageId: 'noHttpUrl',
            data: {
              url: node.value,
            },
            fix: (fixer: any) => {
              return fixer.replaceText(node, `'${node.value.replace('http:', 'https:')}'`);
            },
          });
        }
      },
    };
  },
};
