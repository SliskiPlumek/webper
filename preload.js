const { contextBridge, ipcRenderer } = require("electron");
const os = require("os");
const path = require("node:path");

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
})