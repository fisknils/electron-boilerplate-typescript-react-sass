import { ipcMain } from "electron";

ipcMain.on("version", (event) => {
  event.returnValue = process.version;
});
