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
    quotes: [2, 'single'],
    'comma-dangle': [2, 'always-multiline'],
    'react/jsx-no-undef': 2,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
  },
};
