const {Builder, By, Key, until} = require('selenium-webdriver');
const path = require('path');

// const auto_code_detect = aria-label="Dismiss"
let message = 'Hello there.';
let MESSAGE_LIMIT = 5;
let ws = null;

let USER_MESSAGE_COUNT = 0;
let CURRENT_USER_INDEX = 0;
let CURRENT_ACCOUNT_INDEX = 0;

const INSTA_MESSAGE_BTN = 'x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w x972fbf xcfux6l x1qhh985 xm0m39n xdl72j9 x2lah0s xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x2lwn1j xeuugli xexx8yu x18d9i69 x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1lq5wgf xgqcy7u x30kzoy x9jhf4c x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x78zum5 x1f6kntn xwhw2v2 x10w6t97 xl56j7k x17ydfre x1swvt13 x1pi30zi x1n2onr6 x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye x1gjpkn9 x5n08af xsz8vos';
const INTA_MESSAGE_SEND = 'x1i10hfl xjqpnuy xa49m3k xqeqjp1 x2hbi6w xdl72j9 x2lah0s xe8uvvx xdj266r xat24cr x1mh8g0r x2lwn1j xeuugli x1hl2dhg xggy1nq x1ja2u2z x1t137rt x1q0g3np x1lku1pv x1a2a7pz x6s0dn4 xjyslct x1ejq31n xd10rxx x1sy0etr x17r0tee x9f619 x1ypdohk x1f6kntn xwhw2v2 xl56j7k x17ydfre x2b8uid xlyipyv x87ps6o x14atkfc xcdnw81 x1i0vuye xjbqb8w xm3z3ea x1x8b98j x131883w x16mih1h x972fbf xcfux6l x1qhh985 xm0m39n xt0psk2 xt7dq6l xexx8yu x4uap5 x18d9i69 xkhd6sd x1n2onr6 x1n5bzlp x173jzuc x1yc6y37 xfs2ol5'
const INSTA_FOLLOW_BTN = '_acan _acap _acas _aj1- _ap30';
const INSTA_CHANGE_ACCOUNT_BTN = '_acuq _acur';
const INSTA_BODY = '_a3wf system-fonts--body segoe';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const reset = () =>{
	USER_MESSAGE_COUNT = 0;
	CURRENT_USER_INDEX = 0;
	CURRENT_ACCOUNT_INDEX = 0;
}

const settings = (action) =>{
	if(action.status){
		message = action.message;
		MESSAGE_LIMIT = action.message_limit

		return 0
	}

	return {message:message, message_limit:MESSAGE_LIMIT};
}

const check_session = async (driver, timer) =>{
	try{
		await sleep(timer)
		await driver.wait(until.elementLocated(By.className(INSTA_BODY)), 2000);

		return true
	} catch(e){
		return false
	}
}

const handle_login = async (driver, username, password) =>{

	try {

			await driver.wait(until.elementLocated(By.name('username')), 10000); 
	    await driver.findElement(By.name('username')).sendKeys(username);
	    await driver.findElement(By.name('password')).sendKeys(password);

	    await sleep(5000);

	    await driver.findElement(By.className('_acan _acap _acas _aj1-')).click();

	    ws.send('==================================')
	    ws.send(`Logged account : ${username}`);
	    ws.send('==================================')

	    await sleep(5000);
	  }	
	  catch(e){
	  	ws.send('==================================')
	  	ws.send(`===> ERROR: Cannot loggin to ${username}`);
	  	ws.send('==================================')
	  }

	  return 0
	}

const check_for_automated_blocker = async (driver, account) =>{
		try{
			await sleep(4000);

			await driver.wait(until.elementLocated(By.className(INSTA_CHANGE_ACCOUNT_BTN)), 2000);

			ws.send(`===> Verification error : ${account}`);
			ws.send(`===> Logging off from ${account}`);

			await driver.quit();

			return true
		} catch(e){
			return false
		}
}


const remove_notification_popup = async (driver) =>{
		try{
			await sleep(4000);

			await driver.wait(until.elementLocated(By.className('_a9-- _ap36 _a9_1')), 5000);;

			await driver.findElement(By.className('_a9-- _ap36 _a9_1')).click();
			ws.send('Popup removed');

			return 0
		} catch(e){
			return 0
		}
}

const handle_follow = async (driver) =>{
		try{
			await sleep(4000);

			await driver.wait(until.elementLocated(By.className(INSTA_FOLLOW_BTN)), 5000);;

			await driver.findElement(By.className(INSTA_FOLLOW_BTN)).click();
			ws.send('User has been followed')

			return 0
		} catch(e){

			ws.send(`===> ERROR: cannot follow this user`);
			return 0
		}
}

const sending_message = async (driver) =>{
		try{

			await sleep(2000);

			await driver.wait(until.elementLocated(By.css('[aria-label="Message"]')), 5000);
			await driver.findElement(By.css('[aria-label="Message"]')).sendKeys(message);

			await sleep(2000);
			
			await driver.findElement(By.className(INTA_MESSAGE_SEND)).click();

			ws.send('message sent to : ' + `${USER_MESSAGE_COUNT+1}`);
			USER_MESSAGE_COUNT++;

			await sleep(2000);

			return 0
		} catch(e){
			ws.send(`===> ERROR: cannot send the message`);
			return 0
		}
}

const handle_user_to_message= async(driver, users, account, initor)=>{	

	while(USER_MESSAGE_COUNT < MESSAGE_LIMIT){

		let isDriver = await initor();

		if(!isDriver){
			 return 'close'
		}

		let isSession = await check_session(driver, 3000);
		if(isSession){

				try{
					await driver.get(`https://www.instagram.com/${users[CURRENT_USER_INDEX].users}/`);
					CURRENT_USER_INDEX++;

					await sleep(5000);

					ws.send(`-> Following user : ${users[CURRENT_USER_INDEX - 1].users}`)
					await handle_follow(driver);

					//if message btn is 0, pass with no increment and continue in the list
					await driver.wait(until.elementLocated(By.className(INSTA_MESSAGE_BTN)), 10000);;

					await driver.findElement(By.className(INSTA_MESSAGE_BTN)).click();
					ws.send('-> Redirecting to user Contact...');

					await sleep(2000);

					ws.send('-> Checking for popup...')
					await remove_notification_popup(driver);

					ws.send('-> Sending message...')
					await sending_message(driver);

				} catch(e){
					ws.send(`===> ERROR: User DM are not open yet`);
				}


			} else {
					return 'close';
				}
		} 

	ws.send(`===> Logging off from ${account}`)
	USER_MESSAGE_COUNT = 0;
	await driver.quit();
	return 0;
}

const main = async(socket, logins, users, initor) =>{

	ws = socket;

	if (ws !== null) {
		ws.send('opening chrome...');

		for(let i= CURRENT_ACCOUNT_INDEX ; i < logins.length ; i++, CURRENT_ACCOUNT_INDEX++){

			let driver = await initor(true);

			if(driver === false){
				return 0
			}

			await driver.get('https://www.instagram.com/');

			const isSession = await check_session(driver, 4000);

			if(isSession){
				await handle_login(driver, logins[i].username, logins[i].password);

				let isBlocked =  await check_for_automated_blocker(driver, logins[i].username);

				if(!isBlocked){
						let status = await handle_user_to_message(driver, users, logins[i].username, initor);

						if(status === 'close'){
							await driver.quit();
							break;
							return 0; 
						}
				}
			} else {
				break;
			}


		}
	}	
	return 0
}

module.exports = {
	main:main,
	reset:reset,
	settings:settings
}
