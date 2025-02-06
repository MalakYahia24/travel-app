const common = require("./webpack.common.js"),
    { merge } = require("webpack-merge"),
    CssMinimizerPlugin = require("css-minimizer-webpack-plugin"),
    path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    devServer: {
        static: './dist',
        port: 3001, // Change this to your desired port
        open: true, // Optional: automatically open the browser
        // You can add more options here
      },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'Client',
        clean: true,
    },
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new CssMinimizerPlugin(),
        ],
        minimize: true,
    },
})