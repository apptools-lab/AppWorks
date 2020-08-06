import * as requireIndex from 'requireindex';

export const rules = requireIndex(`${__dirname}/rules`);
export const configs = requireIndex(`${__dirname}/configs`);

export const processors = {
  '.json': {
    preprocess(text: string) {
      // As JS file
      return [`module.exports = ${text}`];
    },
  },
};
