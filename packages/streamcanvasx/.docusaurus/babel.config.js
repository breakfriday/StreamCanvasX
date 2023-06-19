
module.exports = {
  presets: [
    require.resolve('/home/break_happy/stream_2/node_modules/.pnpm/@docusaurus+core@2.4.1_3lwsldy73qonkf7lzjkvnayuta/node_modules/@docusaurus/core/lib/babel/preset.js'),
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