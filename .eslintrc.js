module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
		jest: true,
	},
	parser: 'babel-eslint',
	extends: 'eslint:recommended',
	plugins: ['react', 'react-hooks', 'import', 'prettier'],
	settings: {
		'import/resolver': {
			node: {
				moduleDirectory: ['node_modules', 'src/'],
			},
		},
	},
	parserOptions: {
		sourceType: 'module',
	},
	rules: {
		'prettier/prettier': 'error',
		'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
		'no-console': 'off',
		'no-debugger': 'off',
		'import/no-unresolved': 2,
		'no-undef': 2,
		'comma-dangle': [2, 'always-multiline'],
		'react/jsx-no-undef': 2,
		'react/jsx-uses-react': 2,
		'react/jsx-uses-vars': 2,
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'no-useless-catch': 'off',
	},
};
