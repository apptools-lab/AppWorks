const path = require('path');

const tsConfigPath = path.join(__dirname, 'tsconfig.json');

const config = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode',
    // ref: https://code.visualstudio.com/api/working-with-extensions/bundling-extension#webpack-critical-dependencies
    // got: 'got',
    // prettier: 'prettier',
    // eslint: 'eslint',
    // '@babel': '@babel',
    // 'import-fresh': 'import-fresh'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: tsConfigPath,
            },
          }
        ]
      }
    ]
  }
};

module.exports = config;