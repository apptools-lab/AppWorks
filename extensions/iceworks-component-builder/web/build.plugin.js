module.exports = ({ onGetWebpackConfig, registerTask }) => {
  onGetWebpackConfig((config) => {
    config.node
      .set('fs', 'empty')
      .set('net', 'empty')
      .set('tls', 'empty');
  });
}
