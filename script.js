document.getElementById('btn-start').addEventListener('click', getShuffle)

const baseUrl = 'https://deckofcardsapi.com/api/deck/'

function getShuffle(e) {
  const urlShuffleCards = `${baseUrl}new/shuffle/?deck_count=1`;

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlShuffleCards, true);  

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      const deckOfCard = deck.deck_id;  

      getFirstTwoCard(deckOfCard)
    }
  }

  xmlHttp.send();

  e.preventDefault();
}

function getFirstTwoCard(deckOfCard) {
  const urlFirstTwoCard = `${baseUrl}${deckOfCard}/draw/?count=2`

  const xmlHttp = new XMLHttpRequest();

  xmlHttp.open("GET", urlFirstTwoCard, true);

  xmlHttp.onload = function() {
    if(this.status === 200){
      const deck = JSON.parse(this.responseText);
      let sumValuesCards = 0;
      let output = '';
      let score = '';

      for(let i = 0; i < deck.cards.length; i++) {
        const srcCard = deck.cards[i].image;
        const valueCard = deck.cards[i].value;
        let numValueCard;

        const row = document.createElement('tr');
        row.className = 'table-body-content'
        row.innerHTML = `
        <td><img src="${srcCard + ' '}"></td>      
        `
        document.getElementById('output').appendChild(row);

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
    
        sumValuesCards += numValueCard        
      }

      const scoreCards = document.createElement('div');
      scoreCards.className = 'card-body';
      scoreCards.innerHTML = `
      <h5 class="card-title">Your score: </h5>
      <p>${sumValuesCards}</p>
      `
      document.getElementById('score').appendChild(scoreCards)
    }
  }

  xmlHttp.send();
}
