module.exports = {
  extends: [require.resolve('tf-lint-config-app/lib/eslint')],
  rules: {
    indent: ['warn', 2, { SwitchCase: 1 }], // 缩进 2
    quotes: ['warn', 'single', 'avoid-escape'], // 单引号
    'no-multiple-empty-lines': ['error', { max: 2 }], // 限制空行
    'no-extra-semi': ['warn'], // 禁止不必要的分号(不会限制要加分号，不需要分号的地方他会报错)
  },
};
