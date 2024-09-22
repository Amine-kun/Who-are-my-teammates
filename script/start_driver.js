const {Builder, By, Key, until} = require('selenium-webdriver');
const Process = require('process');
const {get_chrome_path} = require('./helpers');

const start_driver = async(targeted, headless) => {
	try{
		let driver = null;
		
		if(targeted){

			const chrome = require('selenium-webdriver/chrome');
			const options = new chrome.Options();

			const userAgents = [
			  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
			  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
			];

			options.addArguments(`user-agent=${userAgents[Math.floor(Math.random() * userAgents.length)]}`);

			 const get_path = await get_chrome_path();

			options.addArguments(`user-data-dir=${get_path}`);
			options.addArguments('profile-directory=Default');


			//for botting detection
			options.addArguments('--disable-blink-features=AutomationControlled');

			if(headless){
				// to make it more human-like, disbal this
				options.addArguments('--headless');
			}

			driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

		} else {
			driver = await new Builder().forBrowser('chrome').build();
		}

		return driver

	} catch(e){
		return null
	}
}

module.exports = {
	start_driver
}