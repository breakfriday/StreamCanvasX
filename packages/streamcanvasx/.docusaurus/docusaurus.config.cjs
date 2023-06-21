// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const extractCode = require('@ice/pkg-plugin-docusaurus/remark/extractCode');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'streamcanvasx',
  tagline: 'ICE Component Cool',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: 'StreamCanvasX',
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans',],
  },
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://img.alicdn.com/imgextra/i2/O1CN01jUf9ZP1aKwVvEc58W_!!6000000003312-73-tps-160-160.ico',
  staticDirectories: [],

  plugins: [
    require.resolve('@ice/pkg-plugin-docusaurus/plugin.js'),
    [
      '/home/break_happy/project/stream_21/node_modules/.pnpm/@docusaurus+plugin-content-pages@2.4.1_3lwsldy73qonkf7lzjkvnayuta/node_modules/@docusaurus/plugin-content-pages/lib/index.js',
      {
        path: 'pages',
        routeBasePath: '/pages',
      }
    ],
    require.resolve('@docusaurus/theme-live-codeblock'),
  ],

  presets: [
    [
      '/home/break_happy/project/stream_21/node_modules/.pnpm/@docusaurus+preset-classic@2.4.1_3lwsldy73qonkf7lzjkvnayuta/node_modules/@docusaurus/preset-classic/lib/index.js',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          remarkPlugins: [
            [extractCode, { mobilePreview: false, baseUrl: 'StreamCanvasX' }],
          ],
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
          ],
          routeBasePath: '/',
        },

        theme: {
          customCss: require.resolve('@ice/pkg-plugin-docusaurus/css/custom.css'),
        },

        // For demo preview in mobile mode.
        pages: {
          path: '.docusaurus/demo-pages',
          routeBasePath: '/demos',
          id: 'demo-pages'
        }
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'streamcanvasx',
        logo: {
          src: 'https://img.alicdn.com/imgextra/i1/O1CN01lZTSIX1j7xpjIQ3fJ_!!6000000004502-2-tps-160-160.png',
        },
      },
      prism: {
        theme: require('/home/break_happy/project/stream_21/node_modules/.pnpm/prism-react-renderer@1.3.5_react@18.2.0/node_modules/prism-react-renderer/themes/github'),
        darkTheme: require('/home/break_happy/project/stream_21/node_modules/.pnpm/prism-react-renderer@1.3.5_react@18.2.0/node_modules/prism-react-renderer/themes/dracula'),
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
    }),
};

module.exports = config;
