module.exports = ({ onGetWebpackConfig }) => {
  const defineVariables = {
    'process.env.CLIENT_TOKEN': JSON.stringify('8ea74f33dea670f4bfc99092cea1314e953e3c1a4b8b6b60c48384543114a4e8'),
  };
  onGetWebpackConfig((config) => {
    config.plugin('DefinePlugin').tap(([args]) => {
      return [{ ...args, ...defineVariables }];
    });
    config.node.set('fs', 'empty').set('net', 'empty').set('tls', 'empty');
  });
};
