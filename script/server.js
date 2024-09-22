process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0 ;
const express = require( 'express' );
const bodyParser= require('body-parser');
const url = require('url');

const {start_driver} = require('./start_driver');
// const {close_driver} = require('./close_driver.mjs');
const {main, reset, settings} = require('./script');
const {main_telegram} = require('./telegram_script');
const {WebSocketServer, WebSocket} = require('ws');

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true , limit: '50mb'}))


const wss = new WebSocketServer({ port : 8080});
let status = 'empty';
let isPreStopped = false;

let accounts_data;
let users_data;
let link_data;

const initSelenium = async (state, targeted) =>{

	if(state && !isPreStopped){
		status = 'start'
	}

	if(status === 'start'){
		let driver = null;

		if(targeted){
			driver = await start_driver(true, true);
		} else {
			driver = await start_driver(false, true);
		}

		status = 'ongoing';
		return driver

	} else if(status === 'ongoing'){
		return true;

	} else{
		status = 'start';
		isPreStopped = false;
		return false
	}
}

wss.on('connection', async (ws, request, client)=>{

	//parsing the req url
    const parser = url.parse(request.url, true).query;
    const path = parser["source"];
    const data = parser["data"] || {};

  	ws.on("message", ()=>{
  		status = 'stop';
  		isPreStopped = true;
    });

  	status='start';

  	if(path === "telegram"){
  		await main_telegram(ws, initSelenium, JSON.parse(data), link_data); 
  	} else {
  		await main(ws, accounts_data, users_data, initSelenium);
  	}
	
	ws.send('Bot is Closing...');
	// close_driver();
	ws.close();

});

app.post('/send_data', async(req, res)=>{
	const {accounts, users, links_data} = req.body;

	accounts_data = accounts;
	users_data = users;
	link_data = links_data;

	if(accounts_data?.length > 0 || users_data?.length > 0 || link_data?.length > 0 ){
		res.json('data_received');
	} else{
		res.json('err_1');
	}
})

app.put('/reset_data', async(req, res)=>{

	try{
		reset();
		res.json('DATA_RESET');
	} catch (e){
		console.log(e)
		res.json('err_4')
	}
})

app.get('/settings', async (req, res)=>{
	try{
		let data = await settings({status:false, message:'', message_limit:''});
		res.json(data);
	} catch (e){
		console.log(e)
		res.json('err_2')
	}
})

app.post('/settings', async (req, res)=>{
	const {message, message_limit} = req.body;

	try{
		let data = settings({status:true, message:message, message_limit:parseInt(message_limit)});
		res.json('data_set');
	} catch (e){
		console.log(e)
		res.json('err_3')
	}
})

app.listen(4444, ()=> console.log('bot started ...'));

