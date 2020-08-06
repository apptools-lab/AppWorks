import * as FastScanner from 'fastscan';
import * as lineColumn from 'line-column';
import docsUrl from '../docsUrl';

const RULE_NAME = 'no-sensitive-word';

const defaultWordList = ['stupid', 'foolish', 'silly'];

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
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
      noSensitiveWord: "Detect the sensitive word: '{{word}}'",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const sourceCodeText = sourceCode.getText();

    const wordList = defaultWordList.concat(context.options[0] || []);
    const scanner = new FastScanner(wordList);

    scanner.search(sourceCodeText).forEach((wordInfo) => {
      const [wordIndex, word] = wordInfo;
      const startPositionInfo = lineColumn(sourceCodeText).fromIndex(wordIndex);
      const endPositionInfo = lineColumn(sourceCodeText).fromIndex(wordIndex + word.length - 1);

      context.report({
        loc: {
          start: {
            line: startPositionInfo.line,
            column: startPositionInfo.col,
          },
          end: {
            line: endPositionInfo.line,
            column: endPositionInfo.col,
          },
        },
        messageId: 'noSensitiveWord',
        data: {
          word,
        },
      });
    });

    // Must
    return {};
  },
};
