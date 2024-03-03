const path = require("node:path");
const os = require("os");
const fs = require("fs");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const resizeImg = require("resize-img");

const isMac = process.platform === "darwin";
const isDev = process.env !== "production";

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Webper",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, "./client/views/index.html"));
}

app.whenReady().then(() => {
  createMainWindow();

  
  // const mainMenu = Menu.buildFromTemplate(menu)
  
  mainWindow.on("closed", () => (mainWindow = null));
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

ipcMain.on("select-service", (event, service) => {
  let viewPath = "";

  switch (service) {
    case "resize":
      viewPath = path.join(__dirname, "./client/views/resize.html");
      break;
    case "convert":
      viewPath = path.join(__dirname, "views/convert.html");
      break;
    default:
      viewPath = path.join(__dirname, "index.html");
  }

  mainWindow.loadFile(viewPath);
});

// const menu = [
//   ...(isMac
//     ? [
//         {
//           label: app.name,
//           submenu: [
//             {
//               label: "About",
//               click: createAboutWindow,
//             },
//           ],
//         },
//       ]
//     : []),
//   {
//     role: "fileMenu", // basicly this same, except of shortcut
//     // label: 'File',
//     // submenu: [
//     //   {
//     //     label: "Quit",
//     //     click: () => app.quit(),
//     //     accelerator: 'CmdOrCtrl+W'
//     //   }
//     // ]
//   },
//   ...(!isMac
//     ? [
//         {
//           label: "Help",
//           submenu: [
//             {
//               label: "About",
//               click: createAboutWindow,
//             },
//           ],
//         },
//       ]
//     : []),
// ];

ipcMain.on("select-service", (event, service) => {
  let viewPath, htmlContent;

  switch (service) {
    case "resize":
      viewPath = path.join(__dirname, "./client/views/resize.html");
      htmlContent = fs.readFileSync(viewPath, "utf-8");
      event.reply("update-view", htmlContent);
      break;
    case "convert":
      viewPath = path.join(__dirname, "./client/views/convert.html");
      htmlContent = fs.readFileSync(viewPath, "utf-8");
      event.reply("update-view", htmlContent);
      break;
    default:
      viewPath = path.join(__dirname, "./client/views/index.html");
      htmlContent = fs.readFileSync(viewPath, "utf-8");
      event.reply("update-view", htmlContent);
  }
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit;
  }
});
