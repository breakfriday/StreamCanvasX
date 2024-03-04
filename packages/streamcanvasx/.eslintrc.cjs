// const { getESLintConfig } = require('@applint/spec');

// module.exports = getESLintConfig(
//   'common-ts',
// );


const { getESLintConfig } = require('@applint/spec');

const config = getESLintConfig('common-ts');

// 覆盖或添加规则
config.rules['camelcase'] = 'off'; // 关闭 camelcase 规则

module.exports = config;
