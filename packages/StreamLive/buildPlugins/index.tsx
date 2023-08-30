import * as path from 'path';
import type { Plugin } from '@ice/app/types';

const plugin: Plugin = () => ({
  name: 'my-plugin',
  setup: ({ onGetConfig }) => {
    onGetConfig((config) => {
        config.devServer = {
            headers: {
                'X-Custom-Foo': 'bar',
                'Cross-Origin-Embedder-Policy': 'require-corp',
                'Cross-Origin-Opener-Policy': 'same-origin',
              },

        };
    });
  },
});

export default plugin;

