const path = require("node:path");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const os = require("os");
const resizeImg = require("resize-img");

const isMac = process.platform === "darwin";
const isDev = process.env !== "production"

let mainWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Webper",
    width: isDev ? 1000 : 500,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    },
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const route = (new URL(url)).pathname
    console.log(route);

    // switch(route) {
    //   case '/resize':
    //     console.log('accessing /resize');
    //   break
    //   case '/convert':
    //     mainWindow.loadFile(path.join(__dirname, "./client/views/convert.html"))
    // }
  })

  if(isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile(path.join(__dirname, "./client/views/index.html"))
}

app.whenReady().then(() => {
  createMainWindow()

  // const mainMenu = Menu.buildFromTemplate(menu)

  mainWindow.on('closed', () => (mainWindow = null))

  app.on("activate", () => {
    if(BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

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

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit;
  }
});