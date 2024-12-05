const fs = require('fs').promises;
const {past} = require("copy-paste");

const walmart_short_btn = "relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white group-focus-within:text-navbarInputFocused rounded-r-md bg-navbarInputButton group-focus-within:bg-navbarInputButtonFocused hover:bg-primary-800 focus:none cursor-pointer";
const walmart_copy_link_btn = "inline-flex w-full justify-center rounded-md bg-mblue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-400 sm:mr-3 sm:w-auto";

const get_settings_telegram = async () => {
    try{
        let data = await fs.readFile('telegram_settings.json', 'utf8');
        let parsed_data = JSON.parse(data)
        return parsed_data
    } catch(e){

        return {
            api_key: "",
            group_id: "",
            time: 1
        }
    }
}

const save_settings_telegram = (data) => {
    const json = JSON.stringify(data);
    fs.writeFile('telegram_settings.json', json, 'utf8', ()=>{
        console.log("Json file has been saved")
    });

    return true
}

const pasteText = () => {
  return new Promise((resolve, reject) => {
    paste((err, text) => {
      if (err) {
        reject(err);
      } else {
        resolve(text);
      }
    });
  });
};


const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    get_settings_telegram,
    save_settings_telegram,
    sleep,
    pasteText,
    walmart_short_btn,
    walmart_copy_link_btn
}