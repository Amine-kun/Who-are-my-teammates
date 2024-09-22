const {Builder, By, Key, until} = require('selenium-webdriver');
// const Process = require('process');
// const psList = require('ps-list');

// import psList from "ps-list";
// import {Builder, By, Key, until} from "selenium-webdriver";
// import Process from "process";

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

      options.addArguments('user-data-dir=C:\\Users\\nasr\\AppData\\Local\\Google\\Chrome\\User Data');
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

// const close_driver = async () => {
//    const processes = await psList();
//      const chromeProcesses = processes.filter(p => p.name.toLowerCase().includes('chrome'));

//      chromeProcesses.forEach(p => {
//         try {
//             Process.kill(p.pid);
//         } catch (err) {
//         }
//     })
// }

const main = async () => {
  let driver = await start_driver(true, false);
  console.log(driver)
  if(driver){
    await driver.get('https://chatgpt.com/');

    await driver.findElement(By.id('prompt-textarea')).sendKeys("hello");
    await driver.wait(until.elementLocated(By.css('[aria-label="Send prompt"]')), 5000);
  }
}

main();