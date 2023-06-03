const {app, Menu, Tray, BrowserWindow} = require('electron');
const path = require('path');
const {fork} = require('child_process');
const script = fork(`${__dirname}/script/fn.js`) 

const createWindow =()=>{
    let tray = new Tray(path.join(__dirname,'./assets/icon.png'))
    const win = new BrowserWindow({
	width:1024,
	height:620,
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
        win.hide()
    })
   
    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                win.show()
            }
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true
                app.quit()
            }
        }
    ])
    tray.setContextMenu(contextMenu)

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
