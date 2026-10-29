"use strict";

// Builds the main process in watch mode, serves the renderer with webpack-dev-server
// and (re)starts Electron whenever the main process bundle changes.

const { spawn } = require("child_process");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const electron = require("electron");

const [mainConfig, rendererConfig] = require("../webpack.config")({}, { mode: "development" });

let electronProcess = null;
let restarting = false;

function startElectron() {
  electronProcess = spawn(electron, [".", ...process.argv.slice(2)], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "development", WDS_PORT: String(rendererConfig.devServer.port) },
  });
  electronProcess.on("close", () => {
    if (!restarting) {
      process.exit(0);
    }
  });
}

function restartElectron() {
  if (!electronProcess) {
    return startElectron();
  }
  restarting = true;
  electronProcess.once("close", () => {
    restarting = false;
    startElectron();
  });
  electronProcess.kill();
}

async function main() {
  const devServer = new WebpackDevServer(rendererConfig.devServer, webpack({ ...rendererConfig, mode: "development" }));
  await devServer.start();

  webpack({ ...mainConfig, mode: "development" }).watch({}, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stats.toString({ colors: true, modules: false }));
    if (!stats.hasErrors()) {
      restartElectron();
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
