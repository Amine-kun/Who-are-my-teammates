const os = require('os');
const fs = require('fs');
const path = require('path');

const get_chrome_path = async(targeted, headless) => {
	try{
		
		const platform = os.platform();
	    const homeDir = os.homedir();

	    let userDataPath;

	    switch (platform) {
	        case 'win32': // Windows
	            userDataPath = path.join(homeDir, 'AppData', 'Local', 'Google', 'Chrome', 'User Data');
	            break;

	        case 'darwin': // macOS
	            userDataPath = path.join(homeDir, 'Library', 'Application Support', 'Google', 'Chrome');
	            break;

	        case 'linux': // Linux
	            userDataPath = path.join(homeDir, '.config', 'google-chrome');
	            break;

	        default:
	            throw new Error(`Unsupported platform: ${platform}`);
	    }

	    return userDataPath;

	} catch(e){
		console.log(e);
		return null
	}
}

module.exports = {
	get_chrome_path
}