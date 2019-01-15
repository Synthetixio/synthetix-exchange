module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: 'babel-eslint',
  extends: 'eslint:recommended',
  plugins: ['react'],
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-undef': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
  },
};
