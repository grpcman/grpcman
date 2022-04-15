const {app, BrowserWindow} = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    win.loadFile('dist/index.html')
}

app.whenReady().then(() => {
    createWindow()
})
