const {app, Menu, Tray, BrowserWindow} = require('electron');
const path = require('path');
const {fork} = require('child_process');
const script = fork(`${__dirname}/script/server.js`) 

const createWindow =()=>{
    const win = new BrowserWindow({
	width:500,
	height:790,
	icon: __dirname + '/assets/logo.ico',
   	webPreferences : {
	   preload: path.join(__dirname, 'preload.js')
	},
	resizable:false,
   	autoHideMenuBar: true,
    })
    win.loadFile('main.html')
    win.on('minimize', function (event) {
        event.preventDefault()
    })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', ()=>{
     if(BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
