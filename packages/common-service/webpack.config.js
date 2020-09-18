const path = require('path');
const RemoveBuildDepsPlugin = require('./scripts/removeBuildDepsPlugin');

const tsConfigPath = path.join(__dirname, 'tsconfig.json');

const config = {
  target: 'node',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs',
  },
  externals: {
    vscode: 'commonjs vscode',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: tsConfigPath,
            },
          },
        ],
      },
      {
        test: /rx\.lite\.aggregates\.js/,
        use: 'imports-loader?define=>false',
      },
    ],
  },
};

const plugins = [
  new RemoveBuildDepsPlugin(),
];

module.exports = () => {
  if (process.env.CI) {
    config.plugins = plugins;
  }

  return config;
};
