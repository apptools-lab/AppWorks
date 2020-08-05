import docsUrl from '../docsUrl';

const RULE_NAME = 'no-internal-url';

const defaultUrlList = ['alibaba-inc.com'];

module.exports = {
  name: RULE_NAME,
  meta: {
    docs: {
      url: docsUrl(RULE_NAME),
    },
    fixable: null,
    schema: [
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
    messages: {
      // eslint-disable-next-line
      noInternalUrl: "The url '{{url}}' is not recommended",
    },
  },

  create(context) {
    const reg = new RegExp(defaultUrlList.concat(context.options[0] || []).join('|'));
    return {
      Literal: function handleRequires(node: any) {
        if (reg.test(node.value)) {
          context.report({
            node,
            messageId: 'noInternalUrl',
            data: {
              url: node.value,
            },
          });
        }
      },
    };
  },
};
