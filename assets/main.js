const area = document.querySelector('.data');
const start = document.querySelector('.start');
const mid = document.querySelector('.mid');


const insertUI =(data)=>{
	console.log(data)
	      for (let i = 0; i<data.length; i++){
				mid.innerHTML += `<div class="card">
									          <h4 class="text name">${data[i][0].summoner}</h4>
									          <div class="games ${data[i][0].id}">
									             
									          </div>
									      </div>`

				var game = document.querySelector(`.${data[i][0].id}`);
			if(data[i][0].ranked === false){
				game.innerHTML+=`<h3>No rankeds</h3>`
			} else {

				for(let j = 0; j < data[i].length; j++){

					if(data[i][j].earlyFF){
						game.innerHTML += `<div class="past_game ff"> 
									                <div class="champ">
									                  <h4 class="text">${data[i][j].champ}</h4>
									                </div>
									                <div class="stats">
									                  <h4 class="text">${data[i][j].kills}/${data[i][j].deaths}/${data[i][j].assists}</h4>
									                </div>
									              </div>`
					} else {
						data[i][j].result 
					 ? game.innerHTML += `<div class="past_game win"> 
									                <div class="champ">
									                  <h4 class="text">${data[i][j].champ}</h4>
									                </div>
									                <div class="stats">
									                  <h4 class="text">${data[i][j].kills}/${data[i][j].deaths}/${data[i][j].assists}</h4>
									                </div>
									              </div>`
					 : game.innerHTML += `<div class="past_game lose"> 
									                <div class="champ">
									                  <h4 class="text">${data[i][j].champ}</h4>
									                </div>
									                <div class="stats">
									                  <h4 class="text">${data[i][j].kills}/${data[i][j].deaths}/${data[i][j].assists}</h4>
									                </div>
									              </div>`
					}

				}

			}

		}
}

const fetchData = ()=>{
	const opt = {
		header:{
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		methods: 'GET',
	}
	fetch('http://localhost:4444/getPlayers', opt)
		.then(res=>res.json())
		.then(data=>{
			insertUI(data);
		})
		.catch(err=>console.log(err))
}


start.addEventListener('click',()=>{
	console.log('check');
	fetchData();
})



