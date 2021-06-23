const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
    mode: "production",
    entry: "./src/app.js",
    externals: {
        jquery: "$",
        fabric: "fabric",
        vue: "Vue",
        vuex: "Vuex",
        dropzone: "Dropzone",
        axios: "axios",
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    targets: {
                                        chrome: "58",
                                        ie: "11",
                                    },
                                },
                            ],
                        ],
                        plugins: [
                            "@babel/plugin-transform-runtime",
                            "babel-plugin-transform-modern-regexp",
                        ],
                    },
                },
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, "src"),
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
            {
                test: /\.vue$/i,
                include: path.resolve(__dirname, "src"),
                use: ["vue-loader"],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    resolve: {
        alias: {
            vue$: "vue/dist/vue.runtime.esm.js",
            vue: "vue/dist/vue.esm.js"
        },
        extensions: ["*", ".js", ".vue", ".json"],
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        watchContentBase: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
    },
    target: "es5",
};
