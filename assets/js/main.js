const accounts_label = document.querySelector('.accounts_label');
const users_label = document.querySelector('.users_label');

const main_frame =  document.querySelector('.content');
const tabs =  document.querySelectorAll('.tab');

const modal = document.querySelector('.modal');
const modain_content = document.querySelector('.modain_content');

const settings_tab = document.querySelector('.settings_tab');
const remove_icon = document.querySelector('.remove_icon');
const save = document.querySelector('.save');

const key = document.querySelector('.key');
const group = document.querySelector('.group');
const time = document.querySelector('.time');
const scrolls_by_pixel = document.querySelector('.scrolls_by_pixel');

let accounts_data = null ;
let users_data = null ;
let links_data = null;
let client  = null;

let MESSAGE = '';
let MESSAGE_LIMIT = '';

let API_KEY = "";
let GROUP_ID = "";
let TIME = 1;

let KEYS = "";
let GROUP_URL = "";
let SCROLLS = 1;
let SCROLLS_BY_PIXEL = 1000;

const print = (message, color) =>{
    const log = document.querySelector('.logger');
    log.innerHTML += `<h4 class="message" style="color:${color}">${message}</h4>`;
    log.scrollTop = log.scrollHeight - log.clientHeight;
}

const sleep =(ms)=> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const lunchBot = (source, payload) =>{
    const encodedPayload = encodeURIComponent(JSON.stringify(payload));
    client = new WebSocket(`ws://localhost:8080/?source=${source}&data=${encodedPayload}`);

    client.onopen =(data) =>{
         print('Initiating the Bot', 'orange');
    }
    client.onmessage = (event) =>{

        try {
            let is_data = JSON.parse(event?.data);
             count_view(is_data);
        } catch(e){
            print(event.data);
        }
    }
    client.onclose = () =>{
        print('Bot is Closing...', 'orange');
        params_vieww();
        client  = null;
    }
    
}

const clearBot = (source) =>{
    print('==================================');
    print('Stopping Bot...', 'orange');

    const opt = {
        headers:{
                'Content-Type': 'application/json',
            },
        method: 'PUT',
        body: JSON.stringify({
          status: false,
          source: source
        })
    }

    fetch('http://localhost:4444/reset_data', opt)
        .then(res=>res.json())
        .then(data=>{

            if(data === 'DATA_RESET'){
                print('Cleared.');
            }

            return 0
        })
        .catch(err=>{
            print('Error while stopping the bot,', 'red');
            print('please close it manually.', 'red');
            console.log(err)
        })

        if(source === "telegram"){
            show_telegram();
        } else {
            window.location.reload();
        }
}

const sendData = (key)=>{
    const my_url_check = document.querySelector('.my_url_check');
    const walmart_check = document.querySelector('.walmart_check');
    const amazon_check = document.querySelector('.amazon_check');
    const post_only_check = document.querySelector('.post_only_check');

    print('Reading Files...','orange');

    const opt = {
        headers:{
                'Content-Type': 'application/json',
            },
        method: 'POST',
        body: JSON.stringify({
             accounts: accounts_data,
            users: users_data,
            source: key,
            links_data: links_data,
            is_post_only: post_only_check?.checked
        })
    }

    fetch('http://localhost:4444/send_data', opt)
        .then(res=>res.json())
        .then(data=>{
            
            if (data === 'err_1'){
                print('Error reading data, try again.', 'red')
                return 1
            }

            print('Files are ready...');

            lunchBot(key, {
                keys: KEYS, 
                scrolls: SCROLLS, 
                group_url:GROUP_URL,
                is_my_link: my_url_check?.checked,
                is_amazon: amazon_check?.checked,
                is_walmart: walmart_check?.checked,
                is_post_only: post_only_check?.checked
            });

            return 0
        })
        .catch(err=>{
            print('Error reading data, try again.', 'red');
            console.log(err)
        })
        
}

const Parser = async (eFile) =>{

    let reader = new FileReader();
    var result = {};

    try{

        reader.onload = (e) => {
           var data = e.target.result;
           var workbook = XLSX.read(data, {
               type: 'binary'
           });

           workbook.SheetNames.forEach((sheetName)=>{
              var xl_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              if (xl_row_object.length) result.Sheet1 = xl_row_object;
            })
        };

        reader.onerror = (ex) => {
           console.log('parser_error :', ex);
        };

        reader.readAsBinaryString(eFile.target.files[0]);
        await sleep(3000);
        console.log('result', result)
        return result.Sheet1
    } catch(e){
        console.log(e)
        return false;
    }

};

const update_settings = ()=>{
    const opt = {
        headers:{
                'Content-Type': 'application/json',
            },
        method: 'POST',
        body: JSON.stringify({
          api_key: API_KEY,
          group_id: GROUP_ID,
          time: TIME,
          scrolls_by_pixel:SCROLLS_BY_PIXEL
        })
    }

    fetch('http://localhost:4444/settings', opt)
        .then(res=>res.json())
        .then(data=>{
            
            if (data === 'err_3'){
                print('Error Updating settings, try again.')
                return 1
            }

            print('Settings Updated Successfully');
            return 0
        })
        .catch(err=>{
           print('Error Updating settings, try again.')
            console.log(err)
        })       
}

const get_settings = ()=>{
    const opt = {
        headers:{
                'Content-Type': 'application/json',
            },
        method: 'GET'
    }

    fetch('http://localhost:4444/settings', opt)
        .then(res=>res.json())
        .then(data=>{

            if (data === 'err_2'){
                print('Error Getting settings, try again.')
                return 1
            }

            key.setAttribute('value', data.api_key)
            group.setAttribute('value', data.group_id)
            time.setAttribute('value', data.time)

            return 0
        })
        .catch(err=>{
            print('Error Getting settings, try again.')
            console.log(err)
        })       
}

var show_insta = () => {
    main_frame.innerHTML = `
         <div class="app_name">
            <p class="title_app">Follow/Send Message </br> Instagram Bot</p>
          </div>
          <div class="inputs">
            <label class="label_input accounts_label" for="accounts">
                <img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>
                <input type="file" class="input-file-first input-file-accounts" name="accounts" id="accounts" />
                <h3 class="title">accounts</h3>
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" class="isUploaded" />
                
            </label>

            <label class="label_input users_label" for="users">
                <img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>
                <input type="file" class="input-file-first input-file-users" name="users" id="users"/>
                <h3 class="title">users</h3>
                <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" class="isUploaded" />
                
            </label>
          </div>
          <div>
              <button class="start">Start</button>
              <button class="stop">Stop</button>
          </div>

          <button class="full_btn reset">Restart</button> 

          <div class="logger">
            <h3>Log</h3>
          </div>
     `

     return true
}

var show_telegram = () => {
    main_frame.innerHTML = `
        <div class="params">
            <label class="label_input links_label full_w" for="accounts">
                    <img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>
                    <input type="file" class="input-file-first input-file-links" name="accounts" id="accounts" />
                    <h3 class="title">Links</h3>
                    <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" class="isUploaded" />
                    
                </label>
            <div class="inputs" style="margin-bottom:0px">
                <span class="search input_text">
                  <input type="Input" placeholder="Your keys (ex: car, tv)" class="search-input message keys" />
                </span>
                <span class="search input_text">
                  <input type="number" min="1" placeholder="Number of messages per Account" class="search-input number scrolls" />
                </span>
            </div>
        </div>

        <span class="search input_text" style="width:318px">
          <input type="text"placeholder="Group url" class="search-input number scrolls url" />
        </span>

        <label for="check_url" class="flex flex-row abs-center">
            <input id="check_url" class="my_url_check" type="checkbox" value="1" name="Include my affiliate link">
            <p class="margin_none">Include my affiliate link</p>
        </label>

        <label for="post_only" class="flex flex-row abs-center">
            <input id="post_only" class="post_only_check" type="checkbox" value="1" name="Include my affiliate link">
            <p class="margin_none">Post links only (no scraping)</p>
        </label>

        <!-- here options -->

         <div style="margin-top:20px">
              <button class="start start_telegram">Start</button>
              <button class="stop stop_telegram">Stop and save</button>
          </div>

          <button class="full_btn reset reset_telegram">Clear</button> 

          <div class="logger" style="min-height: 180px;">
            <h3>Log</h3>
          </div>
     `

    //   <div class="inputs" style="margin-bottom: 0px;">
    //     <label for="amazon_url" class="flex flex-row abs-center abs-center-small">
    //         <input id="amazon_url" class="amazon_check" type="checkbox" value="1" name="Amazon">
    //         <p class="margin_none">Amazon</p>
    //     </label>
    //     <label for="walmart_url" class="flex flex-row abs-center abs-center-small">
    //         <input id="walmart_url" class="walmart_check" type="checkbox" value="1" name="Walmart">
    //         <p class="margin_none">Walmart</p>
    //     </label>
    // </div>

     return true
}

var count_view = (data) => {
    const params_section = document.querySelector(".params");

    params_section.innerHTML = `
    <div>
        <p>links loaded: ${data?.loaded}</p>
    </div>
    <div>
        <p>links treated: ${data?.treated}</p>
    </div>
    <div>
        <p>links checked: ${data?.checked}</p>
    </div>

    `

    return ;
}

var params_vieww = () => {
    const params_section = document.querySelector(".params");

    params_section.innerHTML = `
            <label class="label_input links_label full_w" for="accounts">
                    <img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>
                    <input type="file" class="input-file-first input-file-links" name="accounts" id="accounts" />
                    <h3 class="title">Links</h3>
                    <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" class="isUploaded" />
                    
            </label>
            <div class="inputs" style="margin-bottom:0px">
                <span class="search input_text">
                  <input type="Input" placeholder="Your keys (ex: car, tv)" class="search-input message keys" />
                </span>
                <span class="search input_text">
                  <input type="number" min="1" placeholder="Number of messages per Account" class="search-input number scrolls" />
                </span>
            </div>
    `

    return ;
}

const init_selectors_telegram = () => {
    const start_telegram = document.querySelector('.start_telegram');
    const reset_telegram = document.querySelector('.reset_telegram');
    const stop_telegram = document.querySelector('.stop_telegram');
    const links = document.querySelector('.input-file-links');
    const links_label = document.querySelector('.links_label');

    const keys = document.querySelector('.keys');
    const number = document.querySelector('.scrolls');
    const url = document.querySelector('.url');

    links.addEventListener('change', async (e)=>{

        if(e.target.files[0].name.split('.')[1] !== 'xlsx'){
            print('File must be Excel file.', 'red')
            links_label.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>`;

            return 0
        }

        if(e.target.files[0].name !== 'links.xlsx'){
            print('File name must be links.xlsx', 'red')
            links_label.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>`;
            
            return 0
        }

        if(links.value !== null){
            
            links_label.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" class="isUploaded" />`;
            let parsed_data = await Parser(e);
             print('Account file has been added')
            
            if(parsed_data === undefined){
                print('Excel file cannot be empty.', 'red')
                return 0
            }

            links_data = parsed_data;
        } 
    });

    start_telegram.addEventListener('click', ()=>{

        if(links_data === null){
            const my_url_check = document.querySelector('.my_url_check');
            const walmart_check = document.querySelector('.walmart_check');
            const amazon_check = document.querySelector('.amazon_check');
            const post_only_check = document.querySelector('.post_only_check');
            
            print('Starting script', 'blue');
            print('Please wait.', 'blue');

            count_view({loaded:0 , treated:0, checked:0});
            lunchBot("telegram", {
                keys: KEYS, 
                scrolls: SCROLLS, 
                group_url:GROUP_URL, 
                is_my_link: my_url_check?.checked,
                is_amazon: amazon_check?.checked,
                is_walmart: walmart_check?.checked,
                is_post_only: post_only_check?.checked
            });
        } else {
            sendData("telegram");
        }

    })

    reset_telegram.addEventListener('click',()=>{
        if(client !== null){
            print('Please stop the bot before clearing.', 'red');
        } else{
            clearBot("telegram");
        }
    })

    stop_telegram.addEventListener('click',()=>{
        print('Stopping, please wait...', 'orange');
        client.send('close_telegram');
    })

    keys.addEventListener('change', (e)=>{
        KEYS = e.target.value;
    });

    number.addEventListener('change', (e)=>{
        SCROLLS = e.target.value;
    });

    url.addEventListener('change', (e)=>{
        GROUP_URL = e.target.value;
    });
}

const init_selectors_insta = () => {
    const start = document.querySelector('.start');
    const reset = document.querySelector('.reset');
    const stop = document.querySelector('.stop');
    const accounts = document.querySelector('.input-file-accounts');
    const users = document.querySelector('.input-file-users');

    accounts.addEventListener('change', async (e)=>{

        if(e.target.files[0].name.split('.')[1] !== 'xlsx'){
            print('File must be Excel file.', 'red')
            accounts_label.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>`;

            return 0
        }

        if(e.target.files[0].name !== 'users.xlsx'){
            print('File name must be users.xlsx', 'red')
            users_label.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>`;
            
            return 0
        }

        if(accounts.value !== null){
            
            accounts_label.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" class="isUploaded" />`;
            let parsed_data = await Parser(e);
             print('Account file has been added')
            
            if(parsed_data === undefined){
                print('Excel file cannot be empty.', 'red')
                return 0
            }

            accounts_data = parsed_data;
        } 
    });

    users.addEventListener('change', async (e)=>{
        
        if(e.target.files[0].name.split('.')[1] !== 'xlsx'){
            print('File must be Excel file.', 'red')
            users_label.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>`;
            
            return 0
        }

        if(e.target.files[0].name !== 'users_to_message.xlsx'){
            print('File name must be users_to_message.xlsx', 'red')
            users_label.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1091/1091223.png" class="folder"/>`;
            
            return 0
        }

        if(accounts.value !== null){
            
            users_label.innerHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" class="isUploaded" />`;
            let parsed_data = await Parser(e);
             print('Users file has been added', '#13b1d9')
            
            if(parsed_data === undefined){
                print('Excel file cannot be empty.', 'red')
                return 0
            }

            users_data = parsed_data;
        } 

    });

    start.addEventListener('click',()=>{
        if(accounts_data === null || users_data === null){
            print('Please wait for both file', 'red')
            print('to be fully loaded.', 'red')
        } else{
            sendData("insta");
        }
    })

    reset.addEventListener('click',()=>{
        if(client !== null){
            print('Please stop the bot before restarting.', 'red');
        } else{
            clearBot("insta");
        }
    })

    stop.addEventListener('click',()=>{
        print('Stopping, please wait...', 'orange');
        client.send('close');

        client.close();
        client = null;
        print('Bot is Closing...', 'orange')
    })

}


document.addEventListener('DOMContentLoaded', async () => {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(el => el.classList.remove('active_tab'));
            tab.classList.add('active_tab');

            if(tab?.id === "telegram"){
                show_telegram();
                init_selectors_telegram()
            }

            if(tab?.id === "insta"){
                show_insta();
                init_selectors_insta()
            }
        });
    });

    show_telegram();


    settings_tab.addEventListener('click',()=>{
        get_settings();
        modal.classList.add("modal_show");
    });

    remove_icon.addEventListener('click',()=>{
        modal.classList.remove("modal_show");
    });

    save.addEventListener('click',()=>{
        update_settings();
        modal.classList.remove("modal_show");
    });

    key.addEventListener('change', (e)=>{
        API_KEY = e.target.value;
    });

    group.addEventListener('change', (e)=>{
        GROUP_ID = e.target.value;
    });

    time.addEventListener('change', (e)=>{
        TIME = e.target.value;
    });

    scrolls_by_pixel.addEventListener('change', (e)=>{
        SCROLLS_BY_PIXEL = e.target.value;
    });

    init_selectors_telegram();
})



