const area = document.querySelector('.data');
const start = document.querySelector('.start');
const mid = document.querySelector('.mid');
const reset = document.querySelector('.reset');
const api = document.querySelector('.api');

let mockData = [
    [
        {
            "id": "a",
            "ranked": "Solo/Duo",
            "gameTime": "28.23",
            "summoner": "Nelzone95",
            "champ": "Karma",
            "kills": 1,
            "deaths": 9,
            "assists": 8,
            "result": false,
            "earlyFF": false
        },
        {
            "id": "a",
            "ranked": "Solo/Duo",
            "gameTime": "31.22",
            "summoner": "Nelzone95",
            "champ": "Thresh",
            "kills": 2,
            "deaths": 4,
            "assists": 8,
            "result": false,
            "earlyFF": false
        },
        {
            "id": "a",
            "ranked": "Solo/Duo",
            "gameTime": "29.12",
            "summoner": "Nelzone95",
            "champ": "Thresh",
            "kills": 1,
            "deaths": 3,
            "assists": 15,
            "result": true,
            "earlyFF": false
        }
    ],
    [
        {
            "id": "b",
            "summoner": "raaawr",
            "ranked": false
        }
    ],
    [
        {
            "id": "c",
            "ranked": "Solo/Duo",
            "gameTime": "27.18",
            "summoner": "KAYN 3CHIR AKALI XDD",
            "champ": "Kayn",
            "kills": 4,
            "deaths": 6,
            "assists": 4,
            "result": false,
            "earlyFF": false
        },
        {
            "id": "c",
            "ranked": "Solo/Duo",
            "gameTime": "28.67",
            "summoner": "Aminedesu",
            "champ": "MasterYi",
            "kills": 8,
            "deaths": 9,
            "assists": 5,
            "result": true,
            "earlyFF": false
        },
        {
            "id": "c",
            "ranked": "Solo/Duo",
            "gameTime": "32.43",
            "summoner": "Aminedesu",
            "champ": "Brand",
            "kills": 9,
            "deaths": 11,
            "assists": 5,
            "result": false,
            "earlyFF": false
        },
        {
            "id": "c",
            "ranked": "Solo/Duo",
            "gameTime": "26.07",
            "summoner": "Aminedesu",
            "champ": "Hecarim",
            "kills": 8,
            "deaths": 5,
            "assists": 5,
            "result": false,
            "earlyFF": false
        },
        {
            "id": "c",
            "ranked": "Solo/Duo",
            "gameTime": "28.93",
            "summoner": "Aminedesu",
            "champ": "Evelynn",
            "kills": 7,
            "deaths": 5,
            "assists": 8,
            "result": false,
            "earlyFF": false
        },
        {
            "id": "c",
            "ranked": "Solo/Duo",
            "gameTime": "35.48",
            "summoner": "Aminedesu",
            "champ": "Amumu",
            "kills": 3,
            "deaths": 4,
            "assists": 14,
            "result": false,
            "earlyFF": false
        },
        {
            "id": "c",
            "ranked": "Solo/Duo",
            "gameTime": "31.63",
            "summoner": "Aminedesu",
            "champ": "Kayn",
            "kills": 17,
            "deaths": 3,
            "assists": 8,
            "result": true,
            "earlyFF": false
        },
        {
            "id": "c",
            "ranked": "Solo/Duo",
            "gameTime": "35.48",
            "summoner": "Aminedesu",
            "champ": "Amumu",
            "kills": 3,
            "deaths": 4,
            "assists": 14,
            "result": false,
            "earlyFF": false
        },
    ],
    [
        {
            "id": "d",
            "summoner": "LadyboysFeetpics",
            "ranked": false
        }
    ],
    [
        {
            "id": "e",
            "summoner": "uTbWePHilary",
            "ranked": false
        }
    ]
]


const insertUI =(data)=>{
		console.log(data)
	      for (let i = 0; i<data.length; i++){
				
	      		if(i === 0){
	      			mid.innerHTML = `<div class="card">
									          <h4 class="text name">${data[i][0]?.summoner}</h4>
									          <div class="games ${data[i][0]?.id}">
									             
									          </div>
									      </div>`
	      		} else {
	      			mid.innerHTML += `<div class="card">
									          <h4 class="text name">${data[i][0]?.summoner}</h4>
									          <div class="games ${data[i][0]?.id}">
									             
									          </div>
									      </div>`
	      		}

				var game = document.querySelector(`.${data[i][0]?.id}`);
				
			if(data[i][0].ranked === false){
				game.innerHTML += `<div class="past_game ff"> 
									                <div class="champ">
									                  <h4 class="text">no ranked</h4>
									                </div>
									              </div>`
			} else {

				for(let j = 0; j < data[i].length; j++){

					if(data[i][j].earlyFF){
						game.innerHTML += `<div class="past_game ff"> 
									                <div class="champ">
									                  <h4 class="text">${data[i][j]?.champ}</h4>
									                </div>
									                <div class="stats">
									                  <h4 class="text">${data[i][j]?.kills}/${data[i][j]?.deaths}/${data[i][j]?.assists}</h4>
									                </div>
									              </div>`
					} else {
						data[i][j]?.result 
					 ? game.innerHTML += `<div class="past_game win"> 
									                <div class="champ">
									                  <h4 class="text">${data[i][j]?.champ}</h4>
									                </div>
									                <div class="stats">
									                  <h4 class="text">${data[i][j]?.kills}/${data[i][j]?.deaths}/${data[i][j]?.assists}</h4>
									                </div>
									              </div>`

					 : game.innerHTML += `<div class="past_game lose"> 
									                <div class="champ">
									                  <h4 class="text">${data[i][j]?.champ}</h4>
									                </div>
									                <div class="stats">
									                  <h4 class="text">${data[i][j]?.kills}/${data[i][j]?.deaths}/${data[i][j]?.assists}</h4>
									                </div>
									              </div>`
					}

				}

			}

		}
}

const fetchData = (key)=>{
	mid.innerHTML = `<p>Fetching players .....</p>`

	const opt = {
		header:{
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		methods: 'GET',
	}
	fetch(`http://localhost:4444/getPlayers/?key=${key}`, opt)
		.then(res=>res.json())
		.then(data=>{
			console.log(data)
			
			if (data === 'err_1'){
				mid.innerHTML = `<p>You have to join a game first and try again.</p>`
				return 1
			}

			insertUI(data);
			return 0
		})
		.catch(err=>console.log(err))
}



start.addEventListener('click',()=>{
	if(api.value.length < 10 ){
		
		mid.innerHTML = `<p> Please provide your api key </p>`
		return 1
	}
	fetchData(api.value);
})

reset.addEventListener('click',()=>{
	mid.innerHTML = `<p>Players history have been cleared.</p>`

})



