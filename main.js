const path = require("node:path");
const os = require("os");
const fs = require("fs");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const resizeImg = require("resize-img");
const sharp = require("sharp");

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

// Function to convert a single file to WebP format
const convertFiles = async (filePath, width, height) => {
  try {
    const outputFile = path.join(
      createWebperFolder(),
      `${path.parse(filePath).name}.webp`
    );
    await sharp(filePath)
      .resize({
        width: width,
        height: height,
        fit: "inside", // or any other fit mode as per your requirement
      })
      .toFormat("webp")
      .toFile(outputFile);
    console.log(`${filePath} converted to WebP: ${outputFile}`);
  } catch (error) {
    console.error(`Error converting ${filePath} to WebP:`, error);
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

ipcMain.on("submit-convert", async (event, { path, width, height }) => {
  try {
    await convertFiles(path, width, height);

    const outputDir = createWebperFolder();

    shell.showItemInFolder(outputDir);

    event.reply("convert-complete");
    console.log('"works"');
  } catch (error) {
    console.log(error);
  }
  // console.log(path);
  // console.log(width);
  // console.log(height);
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit;
  }
});
