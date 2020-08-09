import {cardValueMapping, getScore} from './utilsFunctions.js';

document.getElementById('btn-single-player').addEventListener('click', startSinglePlayer, {once : true})
document.getElementById('btn-multiplayer').addEventListener('click', startMultiplayer, {once : true})

const baseUrl = 'https://deckofcardsapi.com/api/deck/'
let players = [];

interface ShuffleResponse {
  success: boolean,
  deck_id: string,
  shuffled: boolean,
  remaining: number
}

interface CardResponse {
  image: string,
  value: string,
  suit: string,
  code: string
}

interface DrawCardResponse {
  success: boolean,
  cards: CardResponse[],
  deck_id: string,
  remaining: number
}

function startSinglePlayer(e:MouseEvent) {
  const urlShuffleCards = `${baseUrl}new/shuffle/?deck_count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlShuffleCards, false);  

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck:ShuffleResponse = JSON.parse(this.responseText);
      const deckId:string = deck.deck_id;  
      document.getElementById('btn-single-player').style.display = "none";
      document.getElementById('btn-multiplayer').style.display = "none";
      document.getElementById('rowPlayer').style.visibility = "visible";
      const playerName:string = "Player";
      players.push(playerName)
      createButtons(deckId, playerName);      
      getFirstTwoCards(deckId, true, playerName);
      getFirstTwoCards(deckId, false, '');               
    }
  }

  xmlHttp.send();

  e.preventDefault();
}

function startMultiplayer(e:MouseEvent) {
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body text-center';
  cardBody.setAttribute('id', 'cardBody')  

  const divPlayer = document.createElement('div');
  divPlayer.className = 'input-group mb-3';
  const inputPlayer = document.createElement('input');
  inputPlayer.className = 'form-control';
  inputPlayer.setAttribute('id', 'inputPlayer');
  inputPlayer.setAttribute('type', 'text');
  inputPlayer.setAttribute('placeholder', 'Player name');  
  divPlayer.appendChild(inputPlayer)

  const divBtnAddPlayer = document.createElement('div');
  divBtnAddPlayer.className = 'input-group-append';
  const btnAddPlayer = document.createElement('button');
  btnAddPlayer.className = 'btn btn-outline-primary';
  btnAddPlayer.innerHTML = 'Submit Player';
  btnAddPlayer.setAttribute('type', 'button');
  divBtnAddPlayer.appendChild(btnAddPlayer);
  divPlayer.appendChild(divBtnAddPlayer);
  
  cardBody.appendChild(divPlayer);

  const btnStartGame = document.createElement('button');
  btnStartGame.className = 'btn btn-primary btn-lg btn-block';
  btnStartGame.setAttribute('id', 'btn-start-game');
  btnStartGame.innerHTML = 'Start game';

  cardBody.appendChild(btnStartGame);
 
  document.getElementById('divListGroup').appendChild(cardBody);
        
  btnAddPlayer.addEventListener('click', addPlayer);

  document.getElementById('btn-start-game').style.display = 'block';
  document.getElementById('btn-single-player').style.visibility = "hidden";
  document.getElementById('btn-multiplayer').style.visibility = "hidden";
  
  document.getElementById('btn-start-game').addEventListener('click', startNewGame)
    
  e.preventDefault();
}

function addPlayer(e:MouseEvent) {
  let inputPlayerContent = (<HTMLInputElement>document.getElementById('inputPlayer')).value;
  if(inputPlayerContent === ''){
    alert('Add Player')
    return;
  };
  players.push(inputPlayerContent);  

  const singlePlayer = document.createElement('li');
  singlePlayer.className = 'list-group-item m-2';
  singlePlayer.appendChild(document.createTextNode(inputPlayerContent));
  
  const removeButton = document.createElement('button');
  removeButton.className = 'delete-item secondary-content';
  removeButton.innerHTML = `
  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
  </svg>
  `;
  singlePlayer.appendChild(removeButton); 

  document.getElementById('listOfPlayers').appendChild(singlePlayer);

  removeButton.addEventListener('click', removePlayer);

  (<HTMLInputElement>document.getElementById('inputPlayer')).value = "";

  e.preventDefault();
}

function removePlayer(e:MouseEvent) {
  if((<HTMLElement>e.target).parentElement.classList.contains('delete-item')) {
    if(confirm('Are You Sure?')){
      (<HTMLElement>e.target).parentElement.parentElement.remove();
    }    
  }
}

function startNewGame() {
  const urlStartNewGame = `${baseUrl}new/shuffle/?deck_count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlStartNewGame, false);  

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      const deckId = deck.deck_id; 

      let list = document.getElementById('listOfPlayers').getElementsByTagName('li')
      if(list.length < 1) {
        (<HTMLInputElement>document.getElementById("btn-start-game")).disabled = true;
        alert('Refresh game and add Players');
        return;
      }
      document.getElementById('rowPlayer').style.visibility = "visible";
      document.getElementById('rowDealer').style.visibility = "visible"; 
      document.getElementById('tablePlayer').style.visibility = "visible";
      document.getElementById('tableDealer').style.visibility = "visible";
      document.getElementById('cardBody').style.display = "none";
      document.getElementById('listOfPlayers').style.display = "none";
      document.getElementById('btn-start-game').style.display = "none";       
      
      for(let i = 0; i < players.length; i++) {
        getFirstTwoCards(deckId, true, players[i]);
        createButtons(deckId, players[i]);
      }
      getFirstTwoCards(deckId, false, '');
    }
  }

  xmlHttp.send();
}

function getFirstTwoCards(deckId:string, isPlayer:boolean, playerName:string) {
  const urlFirstTwoCard = `${baseUrl}${deckId}/draw/?count=2`

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlFirstTwoCard, false);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const cardResponse:DrawCardResponse = JSON.parse(this.responseText);
      let cardValueSum = 0;

      const row = document.createElement('div');
      if(isPlayer) {
        row.className = 'body-content';
        row.setAttribute('id', `player${playerName}`);
        document.getElementById('playerCards').appendChild(row);
        const rowPlayerName = document.createElement('h6')
        rowPlayerName.className = 'card-header text-center'
        rowPlayerName.innerHTML = `${playerName}`
        row.appendChild(rowPlayerName)
      } else {
        row.className = 'body-content';
        row.setAttribute('id', 'dealer');
        document.getElementById('dealerCards').appendChild(row);
      }      

      if(isPlayer && cardResponse.cards[0].value == 'ACE' && cardResponse.cards[1].value == 'ACE') {
        showModal(true)
      }

      for(let i = 0; i < cardResponse.cards.length; i++) {
        const cardSrc = cardResponse.cards[i].image;
        const cardValue = cardResponse.cards[i].value;        

        row.innerHTML += `<img src="${cardSrc + ' '}">`;
              
        const cardValueNum = cardValueMapping(cardValue)
    
        cardValueSum += cardValueNum;  
      }           
    
      const cardsScore = document.createElement('div');
      cardsScore.className = 'card-body';    
      if(isPlayer){
        cardsScore.setAttribute('id', `cardScore${playerName}`)
        cardsScore.innerHTML = `
        <h5 class="card-title">${playerName} score: </h5>
        <p id="scorePlayer${playerName}">${cardValueSum}</p>
        `
        document.getElementById('playerOutput').appendChild(cardsScore) 
      } else {
        cardsScore.innerHTML = `
      <h5 class="card-title">Dealer score: </h5>
      <p id="scoreDealer">${cardValueSum}</p>      `
      document.getElementById('dealerScore').appendChild(cardsScore);
      }                 
    }
  }

  xmlHttp.send();
}

function drawCard(deckId:string, isPlayer:boolean, playerName:string) {
  const urlTakenCard = `${baseUrl}${deckId}/draw/?count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlTakenCard, false);

  xmlHttp.onload = function() {
    if(this.status === 200) {
      const cardResponse:DrawCardResponse = JSON.parse(this.responseText);
      const cardSrc = cardResponse.cards[0].image;
      const cardValue = cardResponse.cards[0].value;

      if(isPlayer) {
        document.getElementById(`player${playerName}`).innerHTML += `<img src="${cardSrc + ' '}">`;
      } else {
        document.getElementById('dealer').innerHTML += `<img src="${cardSrc + ' '}">`;
      }     

      const cardValueNum = cardValueMapping(cardValue)

        if(isPlayer) {
          let cardValueSum = document.getElementById(`scorePlayer${playerName}`).innerHTML;     
          let cardNewValueSum = parseInt(cardValueSum) + cardValueNum;  
          document.getElementById(`scorePlayer${playerName}`).innerHTML = `${cardNewValueSum}`;
          if(cardNewValueSum == 21) {
            standGame(deckId, playerName);
          } else if (cardNewValueSum >= 22) {
            standGame(deckId, playerName);
            showAlert(`${playerName} lost the game!`);
          }       
        } else {
          let cardValueSum = document.getElementById('scoreDealer').innerHTML;     
          let cardNewValueSum = parseInt(cardValueSum) + cardValueNum;  
          document.getElementById('scoreDealer').innerHTML = `${cardNewValueSum}`;
          if(cardNewValueSum < 17) {
            drawCard(deckId, false, '');
          } 
        }  
      } 
    }

  xmlHttp.send();
}

function showAlert(errMessage:string) {
  const form = document.getElementById('rowPlayer')
  const container = document.querySelector('.card');
  const alert = document.createElement('div');
  alert.className = 'alert alert-danger';
  alert.appendChild(document.createTextNode(errMessage));

  container.insertBefore(alert, form);

  setTimeout(function() {
    document.querySelector('.alert').remove();
  }, 5000);
}

function createButtons(deckId:string, playerName:string) {
  const btnPlayerTakeCard = document.createElement('button');
  btnPlayerTakeCard.className = 'btn btn-primary';
  btnPlayerTakeCard.innerHTML = 'Hit the card';
  btnPlayerTakeCard.onclick = function() {drawCard(deckId, true, playerName)};
  btnPlayerTakeCard.setAttribute('id', `btnCardHit${playerName}`)
  btnPlayerTakeCard.setAttribute("data-toggle","modal")
  btnPlayerTakeCard.setAttribute("data-target", "#refreshModal")      
  btnPlayerTakeCard.setAttribute('type','button');      

  const btnPlayerStandGame = document.createElement('button');
  btnPlayerStandGame.className = 'btn btn-secondary'; 
  btnPlayerStandGame.innerHTML = 'stand the game'; 
  btnPlayerStandGame.onclick = function() {standGame(deckId, playerName)};    
  btnPlayerStandGame.setAttribute('type','button');
  btnPlayerStandGame.setAttribute('id', `btnStandGame${playerName}`)
  const cardsScore = document.createElement('div');
  cardsScore.className = 'card-body';  
  cardsScore.appendChild(btnPlayerTakeCard);
  cardsScore.appendChild(btnPlayerStandGame);
  document.getElementById('playerOutput').appendChild(cardsScore) 
            
}

function standGame(deckId:string, playerName:string) {
  document.getElementById(`btnCardHit${playerName}`).style.visibility = 'hidden';
  let btnStandGame = document.getElementById(`btnStandGame${playerName}`)  
  btnStandGame.style.visibility = 'hidden';  
  btnStandGame.setAttribute('state', 'stand');
  for(let i = 0; i < players.length; i++){
    let id = `btnStandGame${players[i]}`
    if(document.getElementById(id).getAttribute('state') != 'stand') {
      return;
    } 
  } 
  drawCard(deckId, false, '');
  showModal(false);
}

function findHighestScore(){
  let cardPlayerValueSum = '';  
  let playerMax = '';
  let scorePlayerMax = 0;
  for(let i = 0; i < players.length; i++) {
    let scorePlayer = parseInt(document.getElementById(`scorePlayer${players[i]}`).innerText);
    cardPlayerValueSum += `<h5>${players[i]}:</h5><p>Score: ${scorePlayer}</p>`;
    if(scorePlayer < 22 && scorePlayer > scorePlayerMax) {
      scorePlayerMax = scorePlayer;
      playerMax = players[i]
    }
  }

  let player = {
    playerName: playerMax,
    playerScore: scorePlayerMax
  }

  let singlePlayer = Object.create(player);

  return singlePlayer
}

function showModal(isDoubleAce:boolean) {  
  const singlePlayer = findHighestScore();
  let dealerScore = parseInt(document.getElementById('scoreDealer').innerText);
  let playerScore = `<h5>${singlePlayer.playerName}:</h5><p>Score: ${singlePlayer.playerScore}</p>`;

  if(singlePlayer.playerScore == 0) {
    playerScore = '';
  }

  const modalRefresh = document.createElement('div');
  modalRefresh.className = 'modal fade show';
  modalRefresh.setAttribute("id", "refreshModal"); 


  modalRefresh.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Game summary</h5>
      </div>
      <div class="modal-body">
        <p>${playerScore}</p>
        <p><h5>Dealer: </h5><p>Score: ${dealerScore}</p></p>
        <p>${getScore(isDoubleAce, singlePlayer.playerName, singlePlayer.playerScore, dealerScore)}</p>
      </div>
      <div class="modal-footer text-center">
        <button type="button" class="btn btn-primary" onClick="window.location.reload();">Refresh</button>
      </div>
    </div>
  </div>
  `
  document.querySelector('.container').appendChild(modalRefresh);
}
