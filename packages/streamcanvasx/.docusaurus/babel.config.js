
module.exports = {
  presets: [
    require.resolve('/home/shiyl/work/streamcanvasx/node_modules/.pnpm/@docusaurus+core@2.4.1_eslint@8.42.0_react-dom@18.2.0_react@18.2.0/node_modules/@docusaurus/core/lib/babel/preset.js'),
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