import * as path from 'path';
import docsUrl from '../docsUrl';

const RULE_NAME = 'deps-no-ice-scripts';

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
            depsNoResolutions: 'It is not recommended to use ice-scripts, the new version is ice.js',
        },
    },

    create(context) {

        return {

            // give me methods

        };
    }
};
