import docsUrl from '../docsUrl';

const RULE_NAME = 'recommend-functional-component';

module.exports = {
  name: RULE_NAME,
  meta: {
    docs: {
      url: docsUrl(RULE_NAME),
    },
    fixable: null,
    messages: {
      // eslint-disable-next-line
      recommendFunctionalComponent: "It is not recommended to use class component '{{name}}'",
    },
  },

  create(context) {
    return {
      ClassDeclaration: function handleRequires(node: any) {
        const { name } = node.id;
        let superName = '';
        if (node.superClass) {
          if (node.superClass.name) {
            // class xxx extends Component
            superName = node.superClass.name;
          } else if (node.superClass.property && node.superClass.property.name) {
            // class xxx extends React.Component
            superName = node.superClass.property.name;
          }
        }

        // Class Component
        if (superName === 'Component') {
          context.report({
            node,
            messageId: 'recommendFunctionalComponent',
            data: {
              name,
            },
          });
        }
      },
    };
  },
};
