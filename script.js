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

      getPlayerFirstTwoCard(deckId)
      getDealerFirstTwoCard(deckId)
    }
  }

  xmlHttp.send();

  e.preventDefault();
}

function getPlayerFirstTwoCard(deckId) {
  const urlFirstTwoCard = `${baseUrl}${deckId}/draw/?count=2`

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlFirstTwoCard, false);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      let cardPlayerValueSum = 0;

      //Creating row table for cards
      const rowPlayer = document.createElement('tr');
      rowPlayer.className = 'table-body-content player'
      document.getElementById('playerCards').appendChild(rowPlayer);

      if(deck.cards[0].value == 'ACE' && deck.cards[1].value == 'ACE') {
        showModalAce()
      }

      for(let i = 0; i < deck.cards.length; i++) {
        const cardSrc = deck.cards[i].image;
        const cardValue = deck.cards[i].value;        

        const cardItem = document.createElement('td')
        cardItem.innerHTML = `<img src="${cardSrc + ' '}">`;
        rowPlayer.appendChild(cardItem)  
        
        const cardValueNum = cardValueMapping(cardValue)
    
        cardPlayerValueSum += cardValueNum;  
      }      

      //Counting score
      const scorePlayerCards = document.createElement('div');
      scorePlayerCards.className = 'card-body';
      scorePlayerCards.innerHTML = `
      <h5 class="card-title">Your score: </h5>
      <p id="scorePlayer">${cardPlayerValueSum}</p>
      `
      document.getElementById('playerScore').appendChild(scorePlayerCards)

      //Create buttons to continue the game and stand the game.
      const btnPlayerTakeCard = document.createElement('button');
      btnPlayerTakeCard.className = 'btn btn-primary btn-lg';
      btnPlayerTakeCard.innerHTML = 'Hit the card';
      btnPlayerTakeCard.onclick = function() {drawPlayerCard(deckId)};
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
  }

  xmlHttp.send();
}

function drawPlayerCard(deckId) {
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
      document.querySelector('.player').appendChild(cardNew);

      const cardValueNum = cardValueMapping(cardValue)
  
      let cardValueSum = document.getElementById('scorePlayer').innerHTML;     
      let cardNewValueSum = parseInt(cardValueSum) + cardValueNum;  
      document.getElementById('scorePlayer').innerHTML = `${cardNewValueSum}`;

      if(cardNewValueSum >= 22) {
        drawDealerCard(deckId);
        showModal(deckId);        
        return;
      } else if (cardNewValueSum == 21){
        drawDealerCard(deckId);
        showModal(deckId);
      }           
    }
  }

  xmlHttp.send();
}

function getDealerFirstTwoCard(deckId) {
  const urlFirstTwoCard = `${baseUrl}${deckId}/draw/?count=2`

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlFirstTwoCard, false);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      let cardDealerValueSum = 0;      

      //Creating row table for cards
      const rowDealer = document.createElement('tr');
      rowDealer.className = 'table-body-content dealer'
      document.getElementById('dealerCards').appendChild(rowDealer);

      for(let i = 0; i < deck.cards.length; i++) {
        const srcCard = deck.cards[i].image;
        const cardValue = deck.cards[i].value;        

        const cardItem = document.createElement('td');
        cardItem.innerHTML = `<img src="${srcCard + ' '}">`;
        rowDealer.appendChild(cardItem);

        const cardValueNum = cardValueMapping(cardValue)
    
        cardDealerValueSum += cardValueNum;  
      }

      //Counting score
      const scoreDealerCards = document.createElement('div');
      scoreDealerCards.className = 'card-body';
      scoreDealerCards.innerHTML = `
      <h5 class="card-title">Dealer score: </h5>
      <p id="scoreDealer">${cardDealerValueSum}</p>
      `
      document.getElementById('dealerScore').appendChild(scoreDealerCards);      
    }
  }

  xmlHttp.send();
}

function drawDealerCard(deckId) {
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
      document.querySelector('.dealer').appendChild(cardNew);

      const cardValueNum = cardValueMapping(cardValue)
    
      let cardValueSum = document.getElementById('scoreDealer').innerHTML;     
      let cardNewValueSum = parseInt(cardValueSum) + cardValueNum;  
      document.getElementById('scoreDealer').innerHTML = `${cardNewValueSum}`;      

      if(cardNewValueSum < 17) {
        drawDealerCard(deckId);
      }         
    }
  }

  xmlHttp.send();  
}

function standGame(deckId) {
  drawDealerCard(deckId);
  showModal(deckId);
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

function showModal(deckId) {
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
        <p>${printScore(deckId)}</p>
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

function printScore(deckId) {
  const cardPlayerValueSum = document.getElementById('scorePlayer').textContent;
  const cardDealerValueSum = document.getElementById('scoreDealer').textContent;  

  if(cardPlayerValueSum >= 22) {
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

function showModalAce() {
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
        <p>You win!</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" onClick="window.location.reload();">Refresh</button>
      </div>
    </div>
  </div>
  `
  document.getElementById('btnCardHit').setAttribute("onclick", "this.disabled=true;");
  document.querySelector('.container').appendChild(modalRefresh);
}