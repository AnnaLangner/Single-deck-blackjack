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
      let output = '';

      const srcCard1 = deck.cards[0].image;
      const srcCard2 = deck.cards[1].image;
      const valueCard1 = deck.cards[0].value;
      const valueCard2 = deck.cards[1].value;
      

      if(deck.success === true) {
        output += `
        <div class="row">
          <div class="col-6">
            <div class="card-body">
              <h5 class="card-title">Value: ${valueCard1}</h5>
              <a class="card-text"><img src="${srcCard1}"></a>      
            </div>
          </div>
          <div class="col-6">
            <div class="card-body">
              <h5 class="card-title">Value: ${valueCard2}</h5>
              <a class="card-text"><img src="${srcCard2}"></a>       
            </div>
          </div>          
        </div>
        `        
      } else {
        `<li>Something went wrong!</li>`
      }
      document.querySelector('.output').innerHTML = output;

    }
  }

  xmlHttp.send();
}
