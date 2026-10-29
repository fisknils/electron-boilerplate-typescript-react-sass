"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const tsRule = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: {
    loader: "ts-loader",
    options: { configFile: path.resolve(__dirname, "tsconfig.json") },
  },
};

const resolve = { extensions: [".tsx", ".ts", ".js"] };

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== "production";
  const devtool = isDevelopment ? "eval-source-map" : "source-map";

  const main = {
    name: "main",
    target: "electron-main",
    entry: "./src/main/index.ts",
    output: {
      path: path.resolve(__dirname, "dist/main"),
      filename: "index.js",
    },
    devtool,
    resolve,
    module: { rules: [tsRule] },
    node: { __dirname: false, __filename: false },
  };

  const renderer = {
    name: "renderer",
    target: "electron-renderer",
    entry: "./src/renderer/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist/renderer"),
      filename: "renderer.js",
    },
    devtool,
    resolve,
    module: {
      rules: [
        tsRule,
        {
          test: /\.s[ac]ss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        templateContent: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`,
      }),
    ],
    devServer: {
      hot: true,
      port: Number(process.env.WDS_PORT) || 9080,
      static: false,
    },
  };

  return [main, renderer];
};
