require("dotenv").config();
const path = require("node:path");
const os = require("os");
const fs = require("fs");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const sharp = require("sharp");
const { ChildProcess } = require("node:child_process");

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== "production";

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Webper",
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }

  mainWindow.loadFile(path.join(__dirname, "./client/views/index.html"));
}

app.whenReady().then(() => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

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
      viewPath = path.join(__dirname, "./client/views/convert.html");
      break;
    case "menu":
      viewPath = path.join(__dirname, "./client/views/index.html");
      break;
    default:
      viewPath = path.join(__dirname, "./client/views/index.html");
  }

  mainWindow.loadFile(viewPath);
});

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click: () => app.quit(),
        accelerator: "CmdOrCtrl+W",
      },
    ],
  },
  {
    label: "App",
    submenu: [
      {
        label: "Refresh",
        click: () => {
          const focusedWindow = BrowserWindow.getFocusedWindow();
          focusedWindow.reload();
        },
        accelerator: "CmdOrCtrl+R",
      },
      {
        label: "Toggle Dev Tools",
        click: () => {
          const focusedWindow = BrowserWindow.getFocusedWindow();
          focusedWindow.webContents.toggleDevTools();
        },
        accelerator: "CmdOrCtrl+Shift+I",
      },
      {
        label: "Toggle Full Screen",
        click: () => {
          const focusedWindow = BrowserWindow.getFocusedWindow();
          focusedWindow.fullScreen = !focusedWindow.fullScreen;
        },
        accelerator: "F11",
      },
    ],
  },
];

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

const convertFiles = async (filePath, width, height, format) => {
  try {
    const outputFile = path.join(
      createWebperFolder(),
      `${path.parse(filePath).name}.${format === 'avif' ? 'avif' : 'webp'}`
    );

    let sharpInstance = sharp(filePath).resize({
      width: width,
      height: height,
      fit: "inside",
    });

    if (format === 'avif') {
      sharpInstance = sharpInstance.avif({
        quality: 50,
        lossless: false,
        effort: 4,
        chromaSubsampling: '4:4:4',
        bitdepth: 8
      });
    } else {
      sharpInstance = sharpInstance.toFormat(format);
    }

    await sharpInstance.toFile(outputFile);
  } catch (error) {
    console.error(`Error converting ${filePath} occurred:`, error);
  }
};

function createWebperFolder() {
  const imagesDir = app.getPath("pictures");
  const webperFolderPath = path.join(imagesDir, "webper");

  if (!fs.existsSync(webperFolderPath)) {
    fs.mkdirSync(webperFolderPath);
  }

  return webperFolderPath;
}

ipcMain.on("submit-convert", async (event, { path, width, height, format }) => {
  try {
    await convertFiles(path, width, height, format);

    const outputDir = createWebperFolder();

    shell.showItemInFolder(outputDir);

    event.reply("convert-complete");
  } catch (error) {
    console.log(error);
  }
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit;
    process.exit();
  }
});
