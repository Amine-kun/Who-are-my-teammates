const fs = require('fs').promises;

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



const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    get_settings_telegram,
    save_settings_telegram,
    sleep
}