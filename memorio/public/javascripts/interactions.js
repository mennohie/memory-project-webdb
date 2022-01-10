

// for testing
const cardData = [
    {id : 0, image: 0, text: "bladiebla #1", matchId: 0},
    {id : 1, image: 1, text: "bladiebla #2", matchId: 1},
    {id : 2, image: 2, text: "bladiebla #3", matchId: 2},
    {id : 3, image: 3, text: "bladiebla #4", matchId: 3},
    {id : 4, image: 4, text: "bladiebla #5", matchId: 4},
    {id : 5, image: 5, text: "bladiebla #6", matchId: 5},
    {id : 6, image: 6, text: "bladiebla #7", matchId: 6},
    {id : 7, image: 7, text: "bladiebla #8", matchId: 7},
    {id : 8, image: 0, text: "bladiebla #1", matchId: 0},
    {id : 9, image: 1, text: "bladiebla #2", matchId: 1},
    {id : 10, image: 2, text: "bladiebla #3", matchId: 2},
    {id : 11, image: 3, text: "bladiebla #4", matchId: 3},
    {id : 12, image: 4, text: "bladiebla #5", matchId: 4},
    {id : 13, image: 5, text: "bladiebla #6", matchId: 5},
    {id : 14, image: 6, text: "bladiebla #7", matchId: 6},
    {id : 15, image: 7, text: "bladiebla #8", matchId: 7},
];


//set everything up, including the WebSocket
(function setup() {

    cards = createCards(cardData);
    
    cardGrid = new cardGrid(cards);
  
  })(); //execute immediately