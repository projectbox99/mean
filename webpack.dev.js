var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');


module.exports = webpackMerge(commonConfig, {
	devtool: 'cheap-module-eval-source-map',

	output: {
		path: 'public',
		publicPath: 'http://localhost:3000/',
		filename: '[name].js',
		chunkFilename: '[id].chunk.js'
	},

	plugins: [
		// Uses the publicPath and the filename settings to generate appropriate 
		// <script> and <link> tags in index.html. Here it extracts the CSS buried inside
		// out js bundles into external .css files that the plugin inscribes as <link>
		// tags in index.html.
		new ExtractTextPlugin('[name].css')
	],

	devServer: {
		// configuring the webpack development server
		historyApiFallback: true,
		stats: 'minimal'
	}
});