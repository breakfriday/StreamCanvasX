import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config/
export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus', {
        title: 'streamcanvasx',
        baseUrl: 'StreamCanvasX',
        navBarTitle: 'streamcanvasx',
        // remarkPlugins: [
        //   "require('@ice/remark-react-docgen-docusaurus')",
        // ],
        plugins: [
          '@docusaurus/theme-live-codeblock',

        ],
      },
    ],
  ],
});
