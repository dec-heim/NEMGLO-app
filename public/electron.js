// https://medium.com/@duytq94/bundling-your-react-web-to-a-desktop-app-with-electron-1b19ebcf8933
const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const {PythonShell} = require('python-shell');

let mainWindow = null;
let pyshell = new PythonShell('../backend/app.py');

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

function start_pybackend() {
  pyshell.on('message', function(message) {
    console.log(message);
  })
  pyshell.end(function (err) {
    if (err){
      throw err;
    };
    console.log('finished');
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 2048,
    height: 1024,
    title: "NEMGLO Desktop App"
  });
  start_pybackend()

  mainWindow.loadURL('http://localhost:3000'); //(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../src/index.js')}`); //../build/index.html
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault()
  });
}