const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	webpack: {
		configure: (webpackConfig) => ({
			...webpackConfig,
			optimization: {
				...webpackConfig.optimization,
				minimizer: [
					new TerserPlugin({
						terserOptions: {
							parse: {
								ecma: 8,
							},
							compress: {
								ecma: 5,
								warnings: false,
								comparisons: false,
								inline: 2,
								drop_console: true,
							},
							mangle: {
								safari10: true,
							},
							output: {
								ecma: 5,
								comments: false,
								ascii_only: true,
							},
						},
						parallel: 4,
						cache: true,
						sourceMap: false,
						extractComments: false,
					}),
				],
			},
		}),
	},
};
