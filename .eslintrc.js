// eslint  配置文件
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/eslint-config-standard',
    '@vue/eslint-config-typescript' // 这个是typescript的配置，一定要有
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', 'never']
  }
};
