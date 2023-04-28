const fs = require("fs");
const https = require("https");
const fetch = require('node-fetch');

class parser {
	constructor(){
		this.path = null;
	}

		 getSession(){
		 	//reading and parsing lockfile for user creds

	        try{

	        	if(!this.path){
		            const localAppDataPath = process.env.LOCALAPPDATA;
		            this.path = `${localAppDataPath}\\Riot Games\\Riot Client\\Config\\lockfile`;
			        }

			       
			        const lockfileContents = fs.readFileSync(this.path, 'utf8');

			        const matches = lockfileContents.match(/(.*):(.*):(.*):(.*):(.*)/);
			        const name = matches[1];
			        const pid = matches[2];
			        const port = matches[3];
			        const password = matches[4];
			        const protocol = matches[5];

			        const data = {
			            'raw': lockfileContents,
			            'name': name,
			            'pid': pid,
			            'port': port,
			            'password': password,
			            'protocol': protocol,
			        };
			        return data;
	        } catch(e){
	        	console.log(e)
	        	return 'you must loggin to valorant first';
	        }
	}
}

module.exports.parser = parser;