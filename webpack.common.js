var path = require('path');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var FaviconsWebpackPlugin = require('favicons-webpack-plugin');


module.exports = {
	entry: {
		polyfills: path.resolve(__dirname, 'dev/polyfills.ts'),
		vendor: path.resolve(__dirname, 'dev/vendor.ts'),
		app: path.resolve(__dirname, 'dev/main.ts')
	},

	output: {
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
				loaders: ['ts', 'angular2-template-loader']
				// angular2-template-loader - loads angular components' template and styles
			},
			{	// for component templates
				test: /\.html$/,
				loader: 'html'
			},
			{	// this pattern matches application-wide styles
				test: /\.css$/,
				exclude: 'src',
				loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
			},
			{	// handles component-scoped styles (styleUrls prop)
				test: /\.css$/,
				include: 'src',
				loader: 'raw'
			},
			{	// images and fonts are bundled as well
				test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
				loader: 'file?name=assets/[name].[hash].[ext]'
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

		new FaviconsWebpackPlugin({
			logo: path.resolve(__dirname, 'dev/favicon.ico'),
			prefix: 'icons/',
			emitStats: false,
			statsFilename: path.resolve(__dirname, 'public'),
			persistentCache: false,
			inject: true,
			title: 'Project',
			icons: {
				android: false,
				appleIcon: false,
				appleStartup: false,
				coast: false,
				favicons: true,
				firefox: false,
				opengraph: false,
				twitter: false,
				yandex: false,
				windows: false
			}
		})
	]
}