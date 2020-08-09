export function cardValueMapping(cardValue:string) {  
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

export function getScore(isDoubleAce:boolean, playerName:string, playerScore:number, dealerScore:number) {
  if (isDoubleAce) {
    return `${playerName} win!`;
  }  else if (playerScore >= 22){
    return "lost game";
  } else if (playerScore == 21) {
    return `${playerName} win!`;
  } else if(playerScore < dealerScore && dealerScore > 22 ) {
    return `${playerName} win!`;    
  } else if(playerScore < dealerScore && dealerScore < 22 ) {
    return "lost game";    
  } else if(playerScore > dealerScore && playerScore < 22 ) {
    return `${playerName} win!`;
  } else if(playerScore == dealerScore) {
    return "Push";
  }  
}
