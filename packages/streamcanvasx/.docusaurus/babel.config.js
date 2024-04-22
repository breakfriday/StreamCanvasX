
module.exports = {
  presets: [
    require.resolve('/home/break_happy/project/yuv66/node_modules/.pnpm/@docusaurus+core@2.4.3_@docusaurus+types@2.4.3_eslint@8.55.0_react-dom@18.2.0_react@18.2.0_typescript@5.3.3/node_modules/@docusaurus/core/lib/babel/preset.js'),
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