import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config/
export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus', {
        title: 'StreamCanvasX',
        navBarTitle: 'StreamCanvasX',
        remarkPlugins: [
          "require('@ice/remark-react-docgen-docusaurus')",
        ],
      },
    ],
  ],
});
