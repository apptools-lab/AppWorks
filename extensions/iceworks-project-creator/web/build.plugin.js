module.exports = ({ onGetWebpackConfig, context }) => {
  const defineVariables = {
    'process.env.CLIENT_TOKEN': JSON.stringify(process.env.CLIENT_TOKEN),
  };
  onGetWebpackConfig((config) => {
    config.plugin('DefinePlugin').tap(([args]) => {
      return [{ ...args, ...defineVariables }];
    });
    config.node.set('fs', 'empty');
  });
};
