const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const commonConfig = {
    entry: './src/index.ts', // 入口文件
    resolve: {
      extensions: ['.d.ts','.ts','.tsx', '.js', '.jsx', '.json'], // 解析扩展名
      mainFiles: ['index'],
    },
    module: {
      rules: [
        {
          test: /(.*)(-)?[wW]orker\.[jt]s$/, // Worker 文件
          use: {
            loader: 'worker-loader',
            options: {
              inline: true, // 内联 Worker
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
                    decorators: true
                  },
                  transform: {
                    decoratorMetadata: true,
                    legacyDecorator: true,
                    react: {
                        runtime: 'automatic', // React 17+ JSX 转换
                      },
                  }
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
                decorators: true, // 启用装饰器支持
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
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
        },
        {
          test: /\.module\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader?modules'],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css', // 提取 CSS 文件
      }),
    ],
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all', // 代码分割
    //   },
    // },
  };

  // ESM 配置
const esmConfig = {
    ...commonConfig,
    output: {
      path: path.resolve(__dirname, 'dist/esm'), // 输出到 dist/esm 目录
      filename: 'bundle.esm.js',
      library: {
        type: 'module', // ESM 格式
      },
      environment: {
        module: true, // 启用 ESM 环境
      },
    },
    experiments: {
      outputModule: true, // 启用 ESM 输出
    },
  };


  module.exports=esmConfig;
