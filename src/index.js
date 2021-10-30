import { app, BrowserWindow, autoUpdater } from 'electron';

if (require('electron-squirrel-startup')) { 
  app.quit();
}

let mainWindow;
const server = 'http://3.125.219.248/';
const url = `${server}/update/${process.platform}/${app.getVersion()}`;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    resizable: false,
    titleBarStyle: 'hidden',
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.openDevTools();

  console.info( process.platform, app.getVersion() );

  autoUpdater.setFeedURL({ url })

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})