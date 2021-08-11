const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const tsConfigPath = path.join(__dirname, 'tsconfig.json');
const destPath = path.resolve(__dirname, 'build');

const config = {
  target: 'node',
  entry: './src/extension.ts',
  node: {
    __dirname: false,
  },
  output: {
    path: destPath,
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  externals: {
    vscode: 'commonjs vscode',
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
        {
          from: 'src/templates/*.ejs',
          globOptions: {
            gitignore: true,
          },
          to() {
            return `${destPath}/[name].[ext]`;
          },
        },
      ],
      options: { concurrency: 10 },
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  return config;
};
