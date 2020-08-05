document.getElementById('btn-start').addEventListener('click', getShuffle, {once : true})

const baseUrl = 'https://deckofcardsapi.com/api/deck/'

function getShuffle(e) {
  const urlShuffleCards = `${baseUrl}new/shuffle/?deck_count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlShuffleCards, false);  

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

function getFirstTwoCards(deckId, isPlayer) {
  const urlFirstTwoCard = `${baseUrl}${deckId}/draw/?count=2`

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlFirstTwoCard, false);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      let cardValueSum = 0;

      const row = document.createElement('tr');
      if(isPlayer) {
        row.className = 'table-body-content player'
        document.getElementById('playerCards').appendChild(row);
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
        <p id="scorePlayer">${cardValueSum}</p>
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

function drawCard(deckId, isPlayer) {
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

function createButtons(deckId) {
  const btnPlayerTakeCard = document.createElement('button');
  btnPlayerTakeCard.className = 'btn btn-primary btn-lg';
  btnPlayerTakeCard.innerHTML = 'Hit the card';
  btnPlayerTakeCard.onclick = function() {drawCard(deckId, true)};
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
