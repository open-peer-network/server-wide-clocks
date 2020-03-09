const path = require('path');

module.exports = {
	mode: 'production',
	// entry: path.join(__dirname, 'src/index.ts'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.js', '.ts'],
		modules: [
			path.resolve(__dirname, 'src'),
			'node_modules',
		],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: require.resolve("ts-loader"),
			},
		],
	},
};
