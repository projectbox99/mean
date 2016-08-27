var path = require('path');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
	entry: {
		polyfills: path.resolve(__dirname, 'dev/polyfills.ts'),
		vendor: path.resolve(__dirname, 'dev/vendor.ts'),
		app: path.resolve(__dirname, 'dev/main.ts')
	},

	output: {
		publicPath: '/assets',
		path: path.resolve(__dirname, 'public'),
		filename: '[name].bundle.js'
	},

	resolve: {
		extensions: ['', '.js', '.ts']
	},

	module: {
		loaders: [
			{	// a loader to transpile our Typescript to ES5, guided by tsconfig.json
				test: /\.ts$/,
				exclude: [ 'models', 'routes' ],
				loaders: ['ts', 'angular2-template-loader']
				// angular2-template-loader - loads angular components' template and styles
			},
			{	// for component templates
				test: /\.html$/,
				// include: 'dev/app',
				// exclude: 'dev',
				loader: 'html'
			},
			{	// this pattern matches application-wide styles
				test: /\.css$/,
				include: 'dev',
				exclude: 'dev/app',
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
			},
			{	// handles component-scoped styles (styleUrls prop)
				test: /\.css$/,
				// include: 'dev/app',
				loader: 'raw'
			},
			{	// images and fonts are bundled as well
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'file?name=public/[name].[ext]&context=dev'
			}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			// when bundling the code - keep app code separate from vendor code, 
			// separate from polyfills code
			name: ['app', 'vendor', 'polyfills']
		}),

		new HtmlWebpackPlugin({
			// have webpack inject all generated js and css files into our index.html
			template: path.resolve(__dirname, 'dev/index.html')
		}),

		new CopyWebpackPlugin([
			{ from: 'dev/favicon.ico', to: 'images/favicon.ico' },
			{ from: 'dev/assets', to: 'images' },
			{ from: 'uploads', to: 'uploads' }
		])
	]
}