import docsUrl from '../docsUrl';

const RULE_NAME = 'no-secret-info';

const DANGEROUS_KEYS = ['secret', 'token', 'password'];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: docsUrl(RULE_NAME),
    },
    fixable: null,
    messages: {
      // eslint-disable-next-line
      noSecretInfo: "Detect that the '{{secret}}' might be a secret token, Please check!",
    },
  },

  create(context) {
    const reg = new RegExp(DANGEROUS_KEYS.join('|'));

    return {
      Literal: function handleRequires(node: any) {
        if (
          (node.parent &&
            // var secret = 'test';
            node.parent.type === 'VariableDeclarator' &&
            node.parent.id &&
            reg.test(node.parent.id.name.toLocaleLowerCase())) ||
          // { secret: 'test' };
          (node.parent.type === 'Property' && node.parent.key && reg.test(node.parent.key.name.toLocaleLowerCase()))
        ) {
          context.report({
            node,
            messageId: 'noSecretInfo',
            data: {
              secret: node.value,
            },
          });
        }
      },
    };
  },
};
