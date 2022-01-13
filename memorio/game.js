//@ts-check

const websocket = require("ws");
const messages = require("./public/javascripts/messages");


/**
 * Game constructor. Every game has two players, identified by their WebSocket.
 * @param {number} gameID every game has a unique game identifier.
 */
const game = function(gameID) {
    this.playerA = null;
    this.playerB = null;
    this.readyA = false;
    this.readyB = false;
    this.currentPlayer = null;
    this.id = gameID;
    this.gameState = "0 PLAYERS"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
    this.time = 0;
    this.turns = [];
    this.cardGrid = null;
};


/*
 * All valid transition states are keys of the transitionStates object.
 */
game.prototype.transitionStates = {
    "0 PLAYERS": 0,
    "1 PLAYERS": 1,
    "2 PLAYERS": 2,
    "PRE-GAME": 3,
    "IN-GAME": 4,
    "A": 5, //A won
    "B": 6, //B won
    "ABORTED": 7
};


/*
 * Not all game states can be transformed into each other; the transitionMatrix object encodes the valid transitions.
 * Valid transitions have a value of 1. Invalid transitions have a value of 0.
 */
game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0], //0 PLAYERS
    [1, 0, 1, 0, 0, 0, 0], //1 PLAYERS
    [0, 0, 0, 1, 0, 0, 1], //2 PLAYERS (note: once we have two players, there is no way back!)
    [0, 0, 0, 0, 1, 0, 1], //PRE-GAME
    [0, 0, 0, 0, 0, 1, 1], // IN GAME
    [0, 0, 0, 0, 0, 1, 0], //A WON
    [0, 0, 0, 0, 0, 1, 0], //B WON
    [0, 0, 0, 0, 0, 0, 0] //ABORTED
  ];

/**
 * Determines whether the transition from state `from` to `to` is valid.
 * @param {string} from starting transition state
 * @param {string} to ending transition state
 * @returns {boolean} true if the transition is valid, false otherwise
 */
game.prototype.isValidTransition = function(from, to) {
    let i, j;
    if (!(from in game.prototype.transitionStates)) {
        return false;
    } else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    } else {
        j = game.prototype.transitionStates[to];
    }

    return game.prototype.transitionMatrix[i][j] > 0;
};

  /**
   * Determines whether the state `s` is valid.
   * @param {string} s state to check
   * @returns {boolean}
   */
game.prototype.isValidState = function(s) {
    return s in game.prototype.transitionStates;
};


/**
 * Checks whether the game is full.
 * @returns {boolean} returns true if the game is full (2 players), false otherwise
 */
game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState == "2 PLAYERS";
};


/**
 * Updates the game status to `w` if the state is valid and the transition to `w` is valid.
 * @param {string} w new game status
 */
game.prototype.setStatus = function(w) {
    if (
        game.prototype.isValidState(w) &&
        game.prototype.isValidTransition(this.gameState, w)
    ) {
        this.gameState = w;
        console.log("[STATUS] %s", this.gameState);
    } else {
        return new Error(
            `Impossible status change from ${this.gameState} to ${w}`
        );
    }
};



/**
 * Adds a player to the game. Returns an error if a player cannot be added to the current game.
 * @param {websocket} p WebSocket object of the player
 * @returns {(string|Error)} returns "A" or "B" depending on the player added; returns an error if that isn't possible
 */
game.prototype.addPlayer = function(p) {
    if (this.gameState != "0 PLAYERS" && this.gameState != "1 PLAYERS") {
        return new Error(
            `Invalid call to addPlayer, current state is ${this.gameState}`
        );
    }

    const error = this.setStatus("1 PLAYERS");
    if (error instanceof Error) {
        this.setStatus("2 PLAYERS");
    }

    if (this.playerA == null) {
        this.playerA = p;
        return "A";
    } else {
        this.playerB = p;
        return "B";
    }
};

game.prototype.readyPlayer = function(pString) {
    if (this.gameState != "2 PLAYERS") {
        return new Error(
            `Invalid call to readyPlayer, current state is ${this.gameState}`
        );
    }  

    if (pString != "A" && pString != "B") {
        return new Error(
            `Invalid call to readyPlayer supplied pString is ${pString}`
        );
    }

    console.log(`Player ${pString} of Game ${this.id} is ready`);

    if (pString == "A"){
        this.readyA = true;
    }
    else if (pString == "B") {
        this.readyB = true;
    }

    let msg = messages.O_PLAYER_READY;
    msg.data = pString
    this.playerA.send(JSON.stringify(msg))
    this.playerB.send(JSON.stringify(msg))

    

}


/**
 * 
 */
game.prototype.doTurn = function() {
    if (this.gameState != "IN-GAME") {
        return new Error(
            `Invalid call to doTurn, current state is ${this.gameState}`
        );
    }
    console.log(`turn of player ${this.currentPlayer == this.playerA ? "A" : "B"}`)
    let turnMsg = messages.O_PLAYER_TURN;
    turnMsg.data = this.turns.length;
    this.currentPlayer.send(JSON.stringify(turnMsg))


    setTimeout(() =>{ 
        console.log(`end of turn of player ${this.currentPlayer == this.playerA ? "A" : "B"}`)

        let endTurnMsg = messages.O_TIMER_RUN_OUT;
        endTurnMsg.data = 0;
        this.currentPlayer.send(JSON.stringify(endTurnMsg))
        this.currentPlayer = this.currentPlayer == this.playerA ? this.playerB : this.playerA;
        this.doTurn()
    
    }, 2000);


};




game.prototype.start = function(cardData) {
    /*
    * once we have two players and they are ready, there is no way back;
    * a new game object is created;
    * if a player now leaves, the game is aborted (player is not preplaced)
    */
    if (this.gameState != "2 PLAYERS") {
        return new Error(
            `Invalid call to start, current state is ${this.gameState}`
        );
    }  
    console.log(`starting game ${this.id}...`)

    this.cardGrid = new CardGrid(cardData);

    let msg = messages.O_MEMORY_BOARD;
    msg.data = cardData;
    this.playerA.send(JSON.stringify(msg));
    this.playerB.send(JSON.stringify(msg));

    this.setStatus("PRE-GAME") // TODO: maybe add a count down timer 3... 2... 1... GO!
    this.setStatus("IN-GAME")
    this.currentPlayer = this.playerA;
    this.doTurn();
}
  


const Card = function(id, image, text, matchId) {
    this.id = id;
    this.matchId = matchId;
    this.text = text;
    this.image = image;
    this.isMatched = false;
    this.isTurned = false;
}

Card.prototype.getClientCard = function() {
    return {"id": this.id}
}

function createCards(cardData) {
    let cards = [];
    cardData.forEach(card => {
        cards.push(
            new Card(card.id, card.image, card.text, card.matchId)
        );
    });
    return cards;
}

const CardGrid = function(cardData) {
    this.cards = createCards(cardData)
    this.turnedCards = []
}

CardGrid.prototype.turnCard = function(cardId) {

    this.cards.every(card => {
        if(card.getId() === cardId) {
            card.isTurned = true;
            this.turnedCards.push(card)
            return false;
        }
        return true;
    });

    if (this.checkTurnedCards.length === 2) {
        this.checkTurnedCards()
    }
}

CardGrid.prototype.checkTurnedCards = function() {
    if (this.checkTurnedCards.length !== 2) {
        return new Error(`length of turnedCards must be 2, the current length is ${this.checkTurnedCards.length}`)
    }
    if (!this.turnedCards[0].isMatched && !this.turnedCards[1].isMatched) {
        const isMatch = this.turnedCards[0].matchId === this.turnedCards[1].matchId;
        if (isMatch) {
            this.turnedCards[0].isMatched = true;
            this.turnedCards[0].isTurned = false;
            this.turnedCards[1].isMatched = true;
            this.turnedCards[1].isTurned = false;
            return true
        }
        else {
            this.turnedCards[0].isTurned = false;
            this.turnedCards[1].isTurned = false;
            this.turnedCards = [];
            return false
        }
    }

}

CardGrid.prototype.getTurnedCards = function() {
    return this.getTurnedCards
}

module.exports = game;
