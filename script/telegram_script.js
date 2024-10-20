const {By, Key, until} = require('selenium-webdriver');
const {create_post} = require('./functions/createPost');
const {sleep, get_settings_telegram} = require('./functions/helpers');
const fs = require('fs');

let BREAK_VALUE = 99999999999999999999999;
let LOOP = 1;
let driver = null;

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

const get_short_link = async (url) => {
    try{
        await sleep(1000);

        let get_btn_text =  await driver.executeScript(`return document.querySelector('[title="Text"]');`);
        await get_btn_text.click();

        await sleep(1000);

        let get_link = await driver.wait(until.elementLocated(By.id('amzn-ss-text-shortlink-textarea')), 2000);

        await sleep(1000);

        let short_url = await get_link?.getText() || false;

        return short_url

    } catch(e){
        console.log('erro at url', e)
        return false
    }
}

const get_data = async (url) => {
  let state = false;
  let title = "";
  let image_url = "";
  let type = "---";

  try {

    await driver.get(url);

    await sleep(2000);

    let get_title =  await driver.executeScript("return document.getElementById('productTitle');");
    title = await get_title?.getText() || "none";

    let get_image = await driver.executeScript("return document.getElementById('landingImage');");
    image_url = await get_image.getAttribute('src');

    let precentageElement =  await driver.wait(until.elementLocated(By.className('savingsPercentage')), 2000);
    
    if(precentageElement){
        state = true;

        type = await precentageElement?.getText() || "discount";
    }

  } catch (error) {

    console.log("Error while scraping product info (code:1)", false);
  	state = false;

  } 


  if(!state){
    try{

        let precentageElement =  await driver.wait(until.elementLocated(By.className('newCouponBadge')), 2000);
        if(precentageElement){
            state = true;

            type = "coupon"
        }

    } catch(e){

        console.log("Error while scraping product info (code:2)", false);
        state = false;
    }
  }

  let my_url =  await get_short_link();

  return {state, title, type, image_url, my_url};
}

async function scrapeTelegramLinks(state_checker, data, pre_defined_urls) {
    try {
        ///////////////////////////////
        const {time, scrolls_by_pixel} = await get_settings_telegram();
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

                await driver.executeScript(`arguments[0].scrollTop -= ${parseInt(scrolls_by_pixel)};`, chatHistory);

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

        let all_links = [];
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

            if(!check_matching && check_pric?.state && check_pric?.type !== "discount" && check_pric?.type !== "coupon"){

                //publish post
                if(check_pric?.my_url){
                    let target_link = data?.is_my_link || data?.is_my_link === "true" ? check_pric?.image_url : link;
                    create_post(target_link, check_pric?.my_url, check_pric?.title);
                }

                new_link.push({
                  link: link,
                  has_discount: check_pric?.state,
                  type: check_pric?.type,
                  title: check_pric?.title
                });

                checked_links++;
                
            }

            print(JSON.stringify({loaded:savedLinks?.length , treated:treated_links, checked:checked_links}), false);
            print(`waiting ${time} seconds...`, false);

            await sleep(time * 1000);
        }

        print("Saving csv files...", false);

        const csvContent = "Link,has_discount,type,title\n" + new_link.map(item => `${item.link},${item.has_discount},${item?.type},${item.title}`).join("\n");
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