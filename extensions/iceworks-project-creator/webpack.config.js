const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const tsConfigPath = path.join(__dirname, 'tsconfig.json');
const outputPath = path.resolve(__dirname, 'build');
const scaffoldGeneratorLibPath = path.join(require.resolve('ice-scaffold-generator'), '..');

const config = {
  target: 'node',
  entry: './src/extension.ts',
  node: {
    __dirname: false,
  },
  output: {
    path: outputPath,
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  externals: {
    vscode: 'commonjs vscode',
    prettier: 'commonjs prettier',
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.join(scaffoldGeneratorLibPath, 'scaffold'), to: path.join(outputPath, 'scaffold') },
        { from: path.join(scaffoldGeneratorLibPath, 'template'), to: path.join(outputPath, 'template') },
      ],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  return config;
};
