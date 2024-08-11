const path = require("path");

module.exports = {
	entry: "./src/",
	module: {
		rules: [
			{
				// test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".ts", ".js"],
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "public/scripts/"),
	},
};
