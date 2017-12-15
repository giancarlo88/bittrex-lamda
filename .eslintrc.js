module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: false,
    node: true,
    es6: true,
    jest: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'require',
    allowImportExportEverywhere: false,
    codeFrame: false
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-console': ['off']
  }
}
