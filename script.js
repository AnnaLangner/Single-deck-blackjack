document.getElementById('btn-start').addEventListener('click', getShuffle)

const baseUrl = 'https://deckofcardsapi.com/api/deck/'

function getShuffle(e) {
  const urlShuffleCards = `${baseUrl}new/shuffle/?deck_count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlShuffleCards, true);  

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      const deckId = deck.deck_id;  

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

  xmlHttp.open("GET", urlFirstTwoCard, true);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      let sumValuesPlayerCards = 0;

      //Creating row table for cards
      const rowPlayer = document.createElement('tr');
      rowPlayer.className = 'table-body-content player'
      document.getElementById('playerCards').appendChild(rowPlayer);

      if(deck.cards[0].value == 'ACE' && deck.cards[1].value == 'ACE') {
        showModalAce()
      }

      for(let i = 0; i < deck.cards.length; i++) {
        const srcCard = deck.cards[i].image;
        const valueCard = deck.cards[i].value;
        let numValueCard;

        const cardItem = document.createElement('td')
        cardItem.innerHTML = `<img src="${srcCard + ' '}">`;
        rowPlayer.appendChild(cardItem)

        if(valueCard === 'JACK'){
          numValueCard = 2;
        } else if (valueCard === 'QUEEN') {
          numValueCard = 3;
        } else if (valueCard === 'KING') {
          numValueCard = 4;
        } else if (valueCard === 'ACE') {
          numValueCard = 11; 
        } else {
          numValueCard = parseInt(valueCard)
        }
    
        sumValuesPlayerCards += numValueCard;  
      }

      //Counting score
      const scorePlayerCards = document.createElement('div');
      scorePlayerCards.className = 'card-body';
      scorePlayerCards.innerHTML = `
      <h5 class="card-title">Your score: </h5>
      <p id="scorePlayer">${sumValuesPlayerCards}</p>
      `
      document.getElementById('playerScore').appendChild(scorePlayerCards)

      //Create buttons to continue the game and end the game.
      const btnPlayerTakeCard = document.createElement('button');
      btnPlayerTakeCard.onclick = function() {drawPlayerCard(deckId)};
      btnPlayerTakeCard.setAttribute("data-toggle","modal")
      btnPlayerTakeCard.setAttribute("data-target", "#refreshModal")
      btnPlayerTakeCard.innerHTML = 'Player take the card';
      btnPlayerTakeCard.className = 'btn btn-primary btn-lg';
      btnPlayerTakeCard.setAttribute('type','button');

      const btnPlayerGameEnd = document.createElement('button');
      btnPlayerGameEnd.onclick = function() {gameEnd(deckId)};
      btnPlayerGameEnd.innerHTML = 'Player quit the game';
      btnPlayerGameEnd.className = 'btn btn-secondary btn-lg';
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

function getDealerFirstTwoCard(deckId) {
  const urlFirstTwoCard = `${baseUrl}${deckId}/draw/?count=2`

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlFirstTwoCard, true);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      let sumValuesDealerCards = 0;

      //Creating row table for cards

      const rowDealer = document.createElement('tr');
      rowDealer.className = 'table-body-content dealer'
      document.getElementById('dealerCards').appendChild(rowDealer);

      for(let i = 0; i < deck.cards.length; i++) {
        const srcCard = deck.cards[i].image;
        const valueCard = deck.cards[i].value;
        let numValueCard;

        const cardItem = document.createElement('td')
        cardItem.innerHTML = `<img src="${srcCard + ' '}">`;
        rowDealer.appendChild(cardItem)

        if(valueCard === 'JACK'){
          numValueCard = 2;
        } else if (valueCard === 'QUEEN') {
          numValueCard = 3;
        } else if (valueCard === 'KING') {
          numValueCard = 4;
        } else if (valueCard === 'ACE') {
          numValueCard = 11; 
        } else {
          numValueCard = parseInt(valueCard)
        }
    
        sumValuesDealerCards += numValueCard;  
      }

      //Counting score
      const scoreDealerCards = document.createElement('div');
      scoreDealerCards.className = 'card-body';
      scoreDealerCards.innerHTML = `
      <h5 class="card-title">Dealer score: </h5>
      <p id="scoreDealer">${sumValuesDealerCards}</p>
      `
      document.getElementById('dealerScore').appendChild(scoreDealerCards)      
    }
  }

  xmlHttp.send();
}

function drawPlayerCard(deckId) {
  const urlTakenCard = `${baseUrl}${deckId}/draw/?count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlTakenCard, true);

  xmlHttp.onload = function() {
    if(this.status === 200) {
      const deck = JSON.parse(this.responseText);
      const cardNewSrc = deck.cards[0].image;
      const cardNewValue = deck.cards[0].value;
      let cardNewValueNum;

      const cardNew = document.createElement('td');
      cardNew.innerHTML = `<img src="${cardNewSrc + ' '}">`;
      document.querySelector('.player').appendChild(cardNew);

      if(cardNewValue === 'JACK'){
        cardNewValueNum = 2;
      } else if (cardNewValue === 'QUEEN') {
        cardNewValueNum = 3;
      } else if (cardNewValue === 'KING') {
        cardNewValueNum = 4;
      } else if (cardNewValue === 'ACE') {
        cardNewValueNum = 11; 
      } else {
        cardNewValueNum = parseInt(cardNewValue)
      }
  
      let cardValueSum = document.getElementById('scorePlayer').innerHTML;     
      let cardNewValueSum = parseInt(cardValueSum) + cardNewValueNum;  
      document.getElementById('scorePlayer').innerHTML = `${cardNewValueSum}`;

      if(cardNewValueSum >= 22) {
        showModal()
      } else if (cardNewValueSum == 21){
        showModal()
      }     
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
      const cardNewSrc = deck.cards[0].image;
      const cardNewValue = deck.cards[0].value;
      let cardNewValueNum;
      
      
        const cardNew = document.createElement('td');
        cardNew.innerHTML = `<img src="${cardNewSrc + ' '}">`;
        document.querySelector('.dealer').appendChild(cardNew);

        if(cardNewValue === 'JACK'){
          cardNewValueNum = 2;
        } else if (cardNewValue === 'QUEEN') {
          cardNewValueNum = 3;
        } else if (cardNewValue === 'KING') {
          cardNewValueNum = 4;
        } else if (cardNewValue === 'ACE') {
          cardNewValueNum = 11; 
        } else {
          cardNewValueNum = parseInt(cardNewValue)
        }
    
        let cardValueSum = document.getElementById('scoreDealer').innerHTML;     
        let cardNewValueSum = parseInt(cardValueSum) + cardNewValueNum;  
        document.getElementById('scoreDealer').innerHTML = `${cardNewValueSum}`;      

      if(cardNewValueSum < 17) {
        drawDealerCard(deckId)
      }         
    }
  }

  xmlHttp.send();  
}

function gameEnd(deckId) {
  drawDealerCard(deckId)
  showModal()

}

function showModal() {
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
        <p>${printScore()}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" onClick="window.location.reload();">Refresh</button>
      </div>
    </div>
  </div>
  `
  document.querySelector('.container').appendChild(modalRefresh)
}

function printScore() {
  const cardPlayerValueSum = document.getElementById('scorePlayer').textContent;
  const cardDealerValueSum = document.getElementById('scoreDealer').textContent;
  console.log(cardPlayerValueSum)
  console.log(cardDealerValueSum)

  if(cardPlayerValueSum >= 22) {
    return "You lose";
  } else if (cardPlayerValueSum == 21) {
    return "You win!";
  } else if(cardPlayerValueSum > cardDealerValueSum) {
    return "You win!";
  } else if(cardPlayerValueSum < cardDealerValueSum) {
    return "You lose";
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
  document.querySelector('.container').appendChild(modalRefresh)
}