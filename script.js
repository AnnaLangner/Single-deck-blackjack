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

      getFirstTwoCard(deckId)
    }
  }

  xmlHttp.send();

  e.preventDefault();
}

function getFirstTwoCard(deckId) {
  const urlFirstTwoCard = `${baseUrl}${deckId}/draw/?count=2`

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlFirstTwoCard, true);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      let sumValuesCards = 0;

      for(let i = 0; i < deck.cards.length; i++) {
        const srcCard = deck.cards[i].image;
        const valueCard = deck.cards[i].value;
        let numValueCard;

        const row = document.createElement('tr');
        row.className = 'table-body-content'
        row.innerHTML = `<td><img src="${srcCard + ' '}"></td>`;
        document.getElementById('cardOutput').appendChild(row);

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
    
        sumValuesCards += numValueCard;  
      }

      const scoreCards = document.createElement('div');
      scoreCards.className = 'card-body';
      scoreCards.innerHTML = `
      <h5 class="card-title">Your score: </h5>
      <p id="score">${sumValuesCards}</p>
      `
      document.getElementById('scoreOutput').appendChild(scoreCards)

      const btnTakeCard = document.createElement('button');
      btnTakeCard.onclick = function() {drawCard(deckId)};
      btnTakeCard.innerHTML = 'Take the card';
      btnTakeCard.className = 'btn btn-primary btn-lg';
      btnTakeCard.setAttribute('type','button');

      const btnGameEnd = document.createElement('button');
      btnGameEnd.onclick = function() {gameEnd(deckId)};
      btnGameEnd.innerHTML = 'Quit the game';
      btnGameEnd.className = 'btn btn-secondary btn-lg';
      btnGameEnd.setAttribute('type','button');

      const continuePlaying = document.createElement('div');
      continuePlaying.className = 'card-body';
      continuePlaying.appendChild(btnTakeCard);
      continuePlaying.appendChild(btnGameEnd);

      document.getElementById('btnOutput').appendChild(continuePlaying);
    }
  }

  xmlHttp.send();
}


function drawCard(deckId) {
  const urlTakenCard = `${baseUrl}${deckId}/draw/?count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlTakenCard, true);

  xmlHttp.onload = function() {
    if(this.status === 200) {
      const deck = JSON.parse(this.responseText);
      const cardNewSrc = deck.cards[0].image;
      const cardNewValue = deck.cards[0].value;
      let cardNewValueNum;

      const cardNew = document.createElement('tr');
      cardNew.className = 'table-body-content';
      cardNew.innerHTML = `<td><img src="${cardNewSrc + ' '}"></td>`;
      document.getElementById('cardOutput').appendChild(cardNew);

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
  
      let cardValueSum = document.getElementById('score').innerHTML;     
      let cardNewValueSum = parseInt(cardValueSum) + cardNewValueNum;  
      document.getElementById('score').innerHTML = `${cardNewValueSum}`;
    }
  }

  xmlHttp.send();
}

function gameEnd(deckId) {
  console.log('Im out')
}