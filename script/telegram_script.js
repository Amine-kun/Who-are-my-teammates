const {By, Key, until} = require('selenium-webdriver');
const fs = require('fs');

let BREAK_VALUE = 99999999999999999999999;
let LOOP = 1;
let driver = null;

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const print = (text, headers) => {
	if(headers){
		ws.send("==========================================");
		ws.send(text);
		ws.send("==========================================");
	}
	return ws.send(text);
}

const containsKeywords = (str, keywords) => {

    if(!str){
        return false;
    }

    const keys = keywords.replace(/\s+/g, "").replace(".", "").split(",");
    const keywordSet = new Set(keys);
    const words = str.split(/\s+/);
    
    for (const word of words) {
        if (keywordSet.has(word)) {
            return true;
        }
    }
    
    return false;
}

const get_data = async (url) => {
  let state = false;
  let title = "";

  try {

    await driver.get(url);

    await sleep(2000);

    let get_title =  await driver.executeScript("return document.getElementById('productTitle');");
    title = await get_title?.getText() || "none";

    let precentageElement =  await driver.executeScript("return document.querySelector('savingsPercentage');");
    
    // let precentageValue = await precentageElement?.getText() || "none";
    state = true;

  } catch (error) {

    console.log("Error while scraping product info (code:1)", false);
  	state = false;

  } 


  if(!state){
    try{

        let precentageElement =  await driver.wait(until.elementLocated(By.className('newCouponBadge')), 2000);
        state = true;

    } catch(e){

        console.log("Error while scraping product info (code:2)", false);
        state = false;
    }
  }

  return {state, title};
}

async function scrapeTelegramLinks(state_checker, data, pre_defined_urls) {
    try {
        ///////////////////////////////
        let savedLinks = [];
        //////////////////////////////

        if(pre_defined_urls?.length > 0){
            savedLinks = pre_defined_urls.map(elem => elem?.links);
        } else {
            await driver.get(data?.group_url);

            // Store the handle of the original tab
            await driver.wait(until.elementLocated(By.className('MessageList')), 10000);

            print("Scrolling down...", false);

            // const check_rotation = await driver.wait(until.elementLocated(By.className('GovSzpfQ')), 5000);

            let go_bottom  = await driver.wait(until.elementLocated(By.css('[aria-label="Go to bottom"]')), 5000);

            if(go_bottom){
                try{
                    await go_bottom.click();
                } catch(e){
                    console.log("cannot go down.")
                }
            }

            
            print("Getting Links on progress...", false);

            let chatHistory = await driver.findElement(By.className('MessageList'));
            let previousHeight = 0;
            let x= 0;

            while (x < parseInt(data?.scrolls)) {
                const check_state = await state_checker();

                if(!check_state){
                     x = BREAK_VALUE;
                }

                x++

                let currentHeight = await driver.executeScript('return arguments[0].scrollHeight', chatHistory);

                await driver.executeScript('arguments[0].scrollTop -= 1500;', chatHistory);

                // await driver.sleep(2000);  

                try {
                    let links = await driver.findElements(By.tagName('a'));

                    for (let link of links) {
                        let href = await link.getAttribute('href');
                        if (href && href?.includes("amzn")) {
                            savedLinks.push(href);
                        }
                    }
                } catch(e){
                    console.log('err')
                } 
            }


            savedLinks = [...new Set(savedLinks)];
            print(JSON.stringify({loaded:savedLinks?.length , treated:0, checked:0}), false);

            if(x === BREAK_VALUE){
                print("Saving links in links.csv before quitting...", false);
                const linksContent = "links\n" + savedLinks.map(item => `${item}`).join("\n");
                fs.writeFileSync('links.csv', linksContent);

                return;
            }
        }

        print("Checking products discounts...", false);
        print("Please wait.", false);

        let new_link = [];
        let treated_links = 0;
        let checked_links = 0;

        for (let link of savedLinks) {
            const check_state = await state_checker();
            if(!check_state){
                 break;
            }

            let check_pric = await get_data(link);
            let check_matching = containsKeywords(check_pric?.title, data?.keys);

            treated_links++;
            print(JSON.stringify({loaded:savedLinks?.length , treated:treated_links, checked:checked_links}), false);
            
            if(!check_matching && check_pric?.state){

                new_link.push({
                  link: link,
                  has_discount: check_pric?.state,
                  title: check_pric?.title
                });

                checked_links++;
                print(JSON.stringify({loaded:savedLinks?.length , treated:treated_links, checked:checked_links}), false);
            }
        }

        print("Saving csv files...", false);

        const csvContent = "Link,has_discount,title\n" + new_link.map(item => `${item.link},${item.has_discount},${item.title}`).join("\n");
        fs.writeFileSync('telegram_links.csv', csvContent);

        const linksContent = "links\n" + savedLinks.map(item => `${item}`).join("\n");
        fs.writeFileSync('links.csv', linksContent);

        print('Results saved to telegram_links.csv');
        print('Raw links saved to link.csv');
        
    } catch (e){
        console.log(e)
    } finally {

        await driver.quit();
    }
}

const main_telegram = async (socket, initor, data, links_data) => {
    ws = socket;

    if (ws !== null) {
        driver = await initor(true, true);

        if(driver === false){
                return 0
        }

        if(links_data?.length > 0){

            await scrapeTelegramLinks(initor, data, links_data)
        } else {

            await scrapeTelegramLinks(initor, data)
        }
    }

    return 0
}


module.exports = {
    main_telegram,
}