import { defineConfig } from '@ice/pkg';

// https://pkg.ice.work/reference/config/
export default defineConfig({
  plugins: [
    [
      '@ice/pkg-plugin-docusaurus', {
        title: 'streamcanvasx',
        baseUrl: '/',
        navBarTitle: 'streamcanvasx',
        // remarkPlugins: [
        //   "require('@ice/remark-react-docgen-docusaurus')",
        // ],
        plugins: [
          '@docusaurus/theme-live-codeblock',

        ],
        sidebarItemsGenerator: async () => {
          return [
            { type: 'doc', id: 'about' },
            { type: 'doc', id: 'index' },
            {
              type: 'category',
              label: '指南',
              collapsed: false,
              items: [
                { type: 'doc', id: 'guide/basic/player' },
                { type: 'doc', id: 'guide/basic/render' },
                { type: 'doc', id: 'guide/basic/interaction' },
              ],
            },
            {
              type: 'category',
              label: '进阶',
              collapsed: true,
              items: [
                { type: 'doc', id: 'guide/advanced/advanced' },
              ],
            },
            { type: 'doc', id: 'API' },
          ];
        },
      },
    ],
  ],

  transform: {
    formats: ['es2017', 'esm'],
  },
});
