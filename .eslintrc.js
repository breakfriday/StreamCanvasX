// const { getESLintConfig } = require('@iceworks/spec');

// module.exports = getESLintConfig('react-ts', {
//   rules: {
//     'react/jsx-filename-extension': 0,
//     '@typescript-eslint/explicit-function-return-type': 0,
//   },
// });


const { getESLintConfig } = require('@applint/spec');

module.exports = getESLintConfig(
  'common-ts',
);
