
module.exports = {
  presets: [
    require.resolve('/home/break_happy/project/stream10/node_modules/.pnpm/@docusaurus+core@2.4.1_3cuz37cpupvxy2oj3ncfox3l6e/node_modules/@docusaurus/core/lib/babel/preset.js'),
    [
      require.resolve('@babel/preset-react'),
      {
        "pragma": "createElement",
        "pragmaFrag": "Fragment",
        "runtime": "classic"
      },
    ],
  ],
};