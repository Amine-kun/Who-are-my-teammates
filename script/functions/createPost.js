const TelegramBot = require('node-telegram-bot-api');
const {get_settings_telegram} = require('./helpers');
const request = require('request');
const fs = require('fs');
const path = require('path');


const filename = "./downloadedImage.png";
const filepath = "../../downloadedImage.png";

const isDev = false;

const downloadImage = (url, file) => {
  return new Promise((resolve, reject) => {
    request.head(url, (err, res, body) => {
      if (err) return reject(err);

      request(url)
        .pipe(fs.createWriteStream(file))
        .on('close', resolve)
        .on('error', reject);
    });
  });
};

const check_groups = async (bot) => {
	bot.getUpdates().then(updates => {
	  const groups = [];
	  updates.forEach(update => {
	    const chat = update.message?.chat;
	    if (chat && (chat.type === 'group' || chat.type === 'supergroup')) {
	      groups.push({
	        id: chat.id,
	        title: chat.title,
	        type: chat.type
	      });
	    }
	  });

	  if (groups.length > 0) {
	    console.log('Groups your bot is part of:');
	    groups.forEach(group => {
	      console.log(`Group Title: ${group.title}, Chat ID: ${group.id}, Type: ${group.type}`);
	    });
	  } else {
	    console.log('Your bot is not part of any groups.');
	  }
	}).catch(error => {
	  console.error('Failed to retrieve updates:', error);
	});
}

const get_group_data = async (bot) => {
	bot.getChat(chatId)
	  .then(chat => {
	    console.log('Chat information:', chat);
	  })
	  .catch(error => {
	    console.error('Failed to retrieve chat information:', error);
	  });
}

const send_messaage = async (bot, group_id, message, has_picture) => {
	
	if(!has_picture){

		bot.sendMessage(group_id, message)
		  .then(() => {
		    console.log('Message sent successfully!');
		  })
		  .catch((error) => {
		    console.error('Failed to send message:', error);
		  });
	} else {

		// const path_image = path.resolve(__dirname, filepath);
		const baseDir = isDev ? __dirname : process.cwd();
		const path_image = path.join(baseDir, 'downloadedImage.png');

		bot.sendPhoto(group_id, path_image, { caption: message })
		  .then(() => {
		    console.log('Image sent successfully!');
		  })
		  .catch((error) => {
		    console.error('Failed to send image:', error);
		  });

	}
}

const create_post = async (imageUrl, url, title) => {
	const {api_key, group_id} = await get_settings_telegram();

	const caption = `
	✨${title}✨ 

	#ad - ${url}
	`;

	if(!imageUrl){
		return false
	}

	try{
		let download = await downloadImage(imageUrl, filename, function(){
		  console.log('done');
		});

		const bot = new TelegramBot(api_key, { polling: false });
		// check_groups(bot);	
		// get_group_data(bot);

		send_messaage(bot, group_id, caption, true);

	} catch(e){
		console.log("ERROR AT TG BOT:", e);

	} finally {
	    return;
	}
}

module.exports = {
	create_post
}