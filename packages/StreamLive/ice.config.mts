import { defineConfig } from '@ice/app';
import request from '@ice/plugin-request';
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
export default defineConfig(() => ({
  ssg: false,
  minify,
  plugins: [request(), store(), auth()],
  compileDependencies: false,
  publicPath: 'https://breakhappy.oss-cn-beijing.aliyuncs.com/streamLive/build/',
  webpack: (webpackConfig) => {
    // 添加 worker-loader

    webpackConfig.module?.rules?.push({
      test: /-worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          inline: 'no-fallback', // 使用内联模式，不生成单独的 worker 文件
        }
      }
    });


    return webpackConfig;
  },
}));
