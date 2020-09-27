const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = ({ onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.node.set('fs', 'empty').set('net', 'empty').set('tls', 'empty');
    config
      .plugin('monaco-editor')
      .use(MonacoWebpackPlugin, [{
        languages: ['json', 'javascript']
      }]);
  });
};
