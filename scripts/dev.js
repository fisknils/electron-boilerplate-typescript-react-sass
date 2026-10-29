"use strict";

// Builds the main process in watch mode, serves the renderer with webpack-dev-server
// and (re)starts Electron whenever the main process bundle changes. Type errors are
// reported by `tsc --watch` running alongside, since esbuild-loader doesn't type-check.

const { spawn } = require("child_process");
const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const electron = require("electron");

const [mainConfig, rendererConfig] = require("../webpack.config")({}, { mode: "development" });

let electronProcess = null;
let restarting = false;

function startElectron() {
  // VS Code's integrated terminal sets ELECTRON_RUN_AS_NODE, which would make Electron run as plain Node.
  const { ELECTRON_RUN_AS_NODE, ...env } = process.env;
  electronProcess = spawn(electron, [".", ...process.argv.slice(2)], {
    stdio: "inherit",
    env: { ...env, NODE_ENV: "development", WDS_PORT: String(rendererConfig.devServer.port) },
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

function startTypeChecker() {
  const tsc = path.join(path.dirname(require.resolve("typescript/package.json")), "bin", "tsc");
  const typeChecker = spawn(process.execPath, [tsc, "--noEmit", "--watch", "--preserveWatchOutput"], {
    stdio: "inherit",
  });
  process.on("exit", () => typeChecker.kill());
}

async function main() {
  startTypeChecker();

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
