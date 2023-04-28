process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0 ;
const express = require( 'express' );
const axios = require('axios');
const {parser} = require('./tokens');
const parseFile = new parser();
const initAuth = parseFile.getSession();

const app = express();

const API_KEY = 'RGAPI-b7183399-8f40-4fa5-8037-5500ef88e734';

let players;
let playersData = [];
let id = ['a','b','c','d','e'];

const toBase = (string) =>{
	return Buffer.from(string).toString('base64');
}

const getChampSelectPlayers = async ()=>{
	const options = {
			method:'GET',
			url:`https://127.0.0.1:${initAuth.port}/chat/v5/participants/champ-select`,
			headers:{
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `Basic ${toBase(`riot:${initAuth.password}`)}`,
				}
			};

	
	const res = await axios.request(options)
	players = res.data.participants;

	return players.length > 0 ? true : false;
}

const fetchSinglePlayer = async ()=>{

	for (let i =0 ; i < players.length ; i++){
		let ranked =[];
		let game = 0;

		const res = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${players[i].name}?api_key=${API_KEY}`)
		const matches = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${res.data.puuid}/ids?api_key=${API_KEY}&type=ranked`)
		
		if(matches.data.length > 0){
			while(game < 8){
				console.log(matches.data[game])
			    
				if(matches.data[game] !== undefined){
					const matchData = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matches.data[game]}?api_key=${API_KEY}`);
					const data = matchData.data.info
					const duration = (data.gameDuration/60).toFixed(2)

					if(data.queueId === 420){
						let target = data.participants.filter((player)=>{
							return player.summonerName === players[i].name
						})
						ranked.push({id:id[i],
									 ranked:'Solo/Duo',
									 gameTime:duration, 
									 summoner:players[i].name, 
									 champ:target[0]?.championName, 
									 kills:target[0]?.kills,
									 deaths:target[0]?.deaths,  
									 assists:target[0]?.assists, 
									 result:target[0]?.win,
									 earlyFF:target[0]?.teamEarlySurrendered})
					}

					if (game === 7 && ranked.length === 0){
						ranked.push({id:i,
									summoner:players[i].name,
				     				 ranked:false})
					}

					game++;
				} else {
					game = 8;
				}
			}
			
		} else{
			ranked.push({id:i,
						summoner:players[i].name,
				     ranked:false})
		}

		playersData.push(ranked);
	}

	
}

app.get('/getPlayers', async(req, res)=>{
	const teammates = await getChampSelectPlayers();
	if(teammates){
		const playersInfo = await fetchSinglePlayer();
		console.log(playersData);
		res.json(playersData);
	} else {
		res.json('You have to join a game first');
	}
})

app.listen(4444, ()=> console.log('server started ...'));

