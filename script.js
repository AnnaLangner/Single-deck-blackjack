document.getElementById('btn-single-player').addEventListener('click', getShuffle, {once : true})
document.getElementById('btn-multiplayer').addEventListener('click', getPlayers, {once : true})

const baseUrl = 'https://deckofcardsapi.com/api/deck/'
let players = [];

function getShuffle(e) {
  const urlShuffleCards = `${baseUrl}new/shuffle/?deck_count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlShuffleCards, true);  

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      const deckId = deck.deck_id;  
      document.getElementById('tablePlayer').style.display = "block";
      document.getElementById('tableDealer').style.display = "block";

      getFirstTwoCards(deckId, true);
      getFirstTwoCards(deckId, false);
      createButtons(deckId);      
    }
  }

  xmlHttp.send();

  e.preventDefault();
}

function getPlayers(e) {
  const card = document.createElement('div');
  card.className = 'card';
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body text-center';
  card.appendChild(cardBody);

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

  document.getElementById('cardOutput').appendChild(cardBody);   
        
  btnAddPlayer.addEventListener('click', addPlayer);  
  
  document.getElementById('btn-start-game').style.display = "block";
  document.getElementById('btn-start-game').addEventListener('click', startNewGame, {once : true})
    
  e.preventDefault();
}

function addPlayer(e) {
  let inputPlayerContent = document.getElementById('inputPlayer').value;
  if(inputPlayerContent === ''){
    alert('Add Player')
    return;
  };
  players.push(inputPlayerContent);  

  const singlePlayer = document.createElement('li');
  singlePlayer.className = 'collection-item';
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

  document.getElementById('inputPlayer').value = "";

  // for(let i = 0; i < players.length; i++) {
  //   console.log(i)
  // }

  e.preventDefault();
}

function removePlayer(e) {
  if(e.target.parentElement.classList.contains('delete-item')) {
    if(confirm('Are You Sure?')){
      e.target.parentElement.parentElement.remove();
    }    
  }
}

function startNewGame() {
  const urlStartNewGame = `${baseUrl}new/shuffle/?deck_count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlStartNewGame, true);  

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      const deckId = deck.deck_id; 
      document.getElementById('tablePlayer').style.display = "block";
      document.getElementById('tableDealer').style.display = "block";
      
      for(let i = 0; i < players.length; i++) {
        getFirstTwoCards(deckId, true, players[i]);
        createButtons(deckId, players[i]);
      }
      getFirstTwoCards(deckId, false);
    }
  }

  xmlHttp.send();
}

function getFirstTwoCards(deckId, isPlayer, playerName) {
  const urlFirstTwoCard = `${baseUrl}${deckId}/draw/?count=2`

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlFirstTwoCard, true);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      let cardValueSum = 0;

      const row = document.createElement('tr');
      if(isPlayer) {
        row.className = 'table-body-content player'
        document.getElementById('playerCards').appendChild(row);
        const rowPlayerName = document.createElement('th');
        rowPlayerName.setAttribute('scope', 'row');
        rowPlayerName.innerHTML = `${playerName}`
        row.appendChild(rowPlayerName)
      } else {
        row.className = 'table-body-content dealer'
        document.getElementById('dealerCards').appendChild(row);
      }      

      if(isPlayer && deck.cards[0].value == 'ACE' && deck.cards[1].value == 'ACE') {
        showModal(deckId, true)
      }

      for(let i = 0; i < deck.cards.length; i++) {
        const cardSrc = deck.cards[i].image;
        const cardValue = deck.cards[i].value;        

        const cardItem = document.createElement('td')
        cardItem.innerHTML = `<img src="${cardSrc + ' '}">`;
        row.appendChild(cardItem)  
        
        const cardValueNum = cardValueMapping(cardValue)
    
        cardValueSum += cardValueNum;  
      }      

      const cardsScore = document.createElement('div');
      cardsScore.className = 'card-body';
      if(isPlayer) {
        cardsScore.innerHTML = `
        <h5 class="card-title">Your score: </h5>
        <p id="scorePlaye${playerName}">${cardValueSum}</p>
        `
        document.getElementById('playerScore').appendChild(cardsScore) 
      } else {
        cardsScore.innerHTML = `
        <h5 class="card-title">Dealer score: </h5>
        <p id="scoreDealer">${cardValueSum}</p>
        `
        document.getElementById('dealerScore').appendChild(cardsScore); 
      }          
    }
  }

  xmlHttp.send();
}

function drawCard(deckId, isPlayer, pleyerName) {
  const urlTakenCard = `${baseUrl}${deckId}/draw/?count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlTakenCard, false);

  xmlHttp.onload = function() {
    if(this.status === 200) {
      const deck = JSON.parse(this.responseText);
      const cardSrc = deck.cards[0].image;
      const cardValue = deck.cards[0].value;

      const cardNew = document.createElement('td');
      cardNew.innerHTML = `<img src="${cardSrc + ' '}">`;

      if(isPlayer) {
        document.querySelector('.player').appendChild(cardNew);
      } else {
        document.querySelector('.dealer').appendChild(cardNew);
      }     

      const cardValueNum = cardValueMapping(cardValue)

      if(isPlayer) {
        let cardValueSum = document.getElementById('scorePlayer').innerHTML;     
        let cardNewValueSum = parseInt(cardValueSum) + cardValueNum;  
        document.getElementById('scorePlayer').innerHTML = `${cardNewValueSum}`;
        if(cardNewValueSum >= 22) {
          drawCard(deckId, false);
          showModal(deckId, false);        
          return;
        } else if (cardNewValueSum == 21){
          drawCard(deckId, false);
          showModal(deckId, false);
        }
      } else {
        let cardValueSum = document.getElementById('scoreDealer').innerHTML;     
        let cardNewValueSum = parseInt(cardValueSum) + cardValueNum;  
        document.getElementById('scoreDealer').innerHTML = `${cardNewValueSum}`;
        if(cardNewValueSum < 17) {
          drawCard(deckId, false);
        } 
      }   
    }
  }

  xmlHttp.send();
}

function createButtons(deckId, playerName) {
  const btnPlayerTakeCard = document.createElement('button');
  btnPlayerTakeCard.className = 'btn btn-primary btn-lg';
  btnPlayerTakeCard.innerHTML = 'Hit the card';
  btnPlayerTakeCard.onclick = function() {drawCard(deckId, true, playerName)};
  btnPlayerTakeCard.setAttribute('id', 'btnCardHit')
  btnPlayerTakeCard.setAttribute("data-toggle","modal")
  btnPlayerTakeCard.setAttribute("data-target", "#refreshModal")      
  btnPlayerTakeCard.setAttribute('type','button');      

  const btnPlayerGameEnd = document.createElement('button');
  btnPlayerGameEnd.className = 'btn btn-secondary btn-lg'; 
  btnPlayerGameEnd.innerHTML = 'stand the game'; 
  btnPlayerGameEnd.onclick = function() {standGame(deckId)};    
  btnPlayerGameEnd.setAttribute('type','button');

  const playerContinuePlaying = document.createElement('div');
  playerContinuePlaying.className = 'card-body';
  playerContinuePlaying.appendChild(btnPlayerTakeCard);
  playerContinuePlaying.appendChild(btnPlayerGameEnd);

  document.getElementById('btnOutput').appendChild(playerContinuePlaying);
}

function standGame(deckId) {
  drawCard(deckId, false);
  showModal(deckId, false);
}

function cardValueMapping(cardValue) {  
  if(cardValue === 'JACK'){
    return 2;
  } else if (cardValue === 'QUEEN') {
    return 3;
  } else if (cardValue === 'KING') {
    return 4;
  } else if (cardValue === 'ACE') {
    return 11; 
  } else {
    return parseInt(cardValue)
  }
}

function showModal(deckId, isDoubleAce) {
  const cardPlayerValueSum = document.getElementById('playerScore').innerHTML;
  const cardDealerValueSum = document.getElementById('dealerScore').innerHTML;
  const modalRefresh = document.createElement('div');
  modalRefresh.className = 'modal fade show';
  modalRefresh.setAttribute("id", "refreshModal"); 

  modalRefresh.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Refresh game</h5>
      </div>
      <div class="modal-body">
        <p>${cardPlayerValueSum}</p>
        <p>${cardDealerValueSum}</p>
        <p>${printScore(deckId, isDoubleAce)}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" onClick="window.location.reload();">Refresh</button>
      </div>
    </div>
  </div>
  `
  document.getElementById('btnCardHit').setAttribute("onclick", "this.disabled=true;");
  document.querySelector('.container').appendChild(modalRefresh)
}

function printScore(deckId, isDoubleAce) {
  const cardPlayerValueSum = document.getElementById('scorePlayer').textContent;
  const cardDealerValueSum = document.getElementById('scoreDealer').textContent;  

  if (isDoubleAce) {
    return "You win";
  } else if(cardPlayerValueSum >= 22) {
    return "You lose";
  } else if (cardPlayerValueSum == 21) {
    return "You win!";
  } else if(cardPlayerValueSum > cardDealerValueSum) {
    return "You win!";
  } else if(cardPlayerValueSum < cardDealerValueSum && cardDealerValueSum < 22 ) {
    return "You lose";    
  } else if(cardPlayerValueSum < cardDealerValueSum && cardDealerValueSum > 21 ) {
    return "You win!";
  } else if(cardPlayerValueSum == cardDealerValueSum) {
    return "Push";
  }
}
