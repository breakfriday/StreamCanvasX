const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.tsx', // Adjust based on your entry file
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
  },
  output: [
    {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.umd.js',
      library: 'MyLibrary',
      libraryTarget: 'umd',
    },
    {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.esm.js',
      libraryTarget: 'module',
      environment: {
        module: true,
      },
    },
  ],
  module: {
    rules: [
        {
            test: /(.*)(-)?[wW]orker\.[jt]s$/, // 匹配 Worker 文件的正则
            use: {
              loader: 'worker-loader',
              options: {
                inline: true, // 是否将 Worker 文件内联到主文件
                // other options can be set here, like `sourcemap`
              },
            },
          },
      {
        test: /\.(tsx|ts)?$/,
        loader: 'swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic', // React 17+ JSX transform
              },
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        loader: 'swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'ecmascript',
              jsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?modules',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  target: ['web', 'es2017'], // To target both ES2017 and the bundle
};
