var webpack = require('webpack');
var path = require('path');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
	entry: {
		background: APP_DIR + '/background.js',
		content: APP_DIR + '/content.js',
		index: APP_DIR + '/index.jsx',
	},
	output: {
		path: BUILD_DIR,
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		modules: [
			path.resolve(__dirname, 'src'),
			path.resolve(__dirname, 'node_modules'),
		],
	},
	module : {
		rules: [
			{
				test : /\.jsx?$/,
				include : [path.resolve(__dirname, 'src')],
				loader : 'babel-loader',
			},
			{
		        test: /\.js$/,
		        exclude: /(node_modules)/,
		        use: {
		            loader: "babel-loader",
		        }
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				exclude: path.resolve(__dirname, 'src/skel/components/svg-icon'),
				loader: 'url-loader',
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
			},
			{
				test: /\.scss$/,
				use: [{
						loader: "style-loader" // creates style nodes from JS strings
				}, {
						loader: "css-loader" // translates CSS into CommonJS
				}, {
						loader: "sass-loader" // compiles Sass to CSS
				}]
			},
		],
		noParse: /node_modules\/(moment)/,
	},
	devtool: 'source-map',
	plugins: [
		new FriendlyErrorsPlugin(),
		new HtmlWebpackPlugin({
			inject:true,
			chunks:'popup.html',
			filename:'popup.html',
			template: 'popup.html',
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	]
};

module.exports = config;