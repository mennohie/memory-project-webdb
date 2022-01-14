//@ts-check

const websocket = require("ws");
const messages = require("./public/javascripts/messages");
const CardGrid = require("./cardGrid")

const TURN_TIME = 5000

/**
 * Game constructor. Every Game has two players, identified by their WebSocket.
 * @param {number} GameID every Game has a unique Game identifier.
 */
const Game = function(GameID) {
    this.playerA = null;
    this.playerB = null;
    this.readyA = false;
    this.readyB = false;
    this.scoreA = 0;
    this.scoreB = 0;
    this.currentPlayer = null;
    this.id = GameID;
    this.gameState = "0 PLAYERS"; //"A" means A won, "B" means B won, "ABORTED" means the Game was aborted
    this.time = 0;
    this.turns = [];
    this.cardGrid = null;
    this.timeoutID = null;
};

Game.prototype.getClientGameState = function() {
    return {
        "id" : this.id,
        "cardGrid" : this.cardGrid.getClientCardGridState(),
        "scoreA" : this.scoreA,
        "scoreB" : this.scoreB,
        "time": this.time      
    }
}

/*
 * All valid transition states are keys of the transitionStates object.
 */
Game.prototype.transitionStates = {
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
 * Not all Game states can be transformed into each other; the transitionMatrix object encodes the valid transitions.
 * Valid transitions have a value of 1. Invalid transitions have a value of 0.
 */
Game.prototype.transitionMatrix = [
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
Game.prototype.isValidTransition = function(from, to) {
    let i, j;
    if (!(from in Game.prototype.transitionStates)) {
        return false;
    } else {
        i = Game.prototype.transitionStates[from];
    }

    if (!(to in Game.prototype.transitionStates)) {
        return false;
    } else {
        j = Game.prototype.transitionStates[to];
    }

    return Game.prototype.transitionMatrix[i][j] > 0;
};

  /**
   * Determines whether the state `s` is valid.
   * @param {string} s state to check
   * @returns {boolean}
   */
Game.prototype.isValidState = function(s) {
    return s in Game.prototype.transitionStates;
};


/**
 * Checks whether the Game is full.
 * @returns {boolean} returns true if the Game is full (2 players), false otherwise
 */
Game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState == "2 PLAYERS";
};


/**
 * Updates the Game status to `w` if the state is valid and the transition to `w` is valid.
 * @param {string} w new Game status
 */
Game.prototype.setStatus = function(w) {
    if (
        Game.prototype.isValidState(w) &&
        Game.prototype.isValidTransition(this.gameState, w)
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
 * Adds a player to the Game. Returns an error if a player cannot be added to the current Game.
 * @param {websocket} p WebSocket object of the player
 * @returns {(string|Error)} returns "A" or "B" depending on the player added; returns an error if that isn't possible
 */
Game.prototype.addPlayer = function(p) {
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

Game.prototype.removePlayer = function(p) {
    if (this.playerA == p) {
        this.playerA = null
        this.setStatus("1 PLAYERS")
    }    

}

Game.prototype.readyPlayer = function(pString) {
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
Game.prototype.doTurn = function() {
    if (this.gameState != "IN-GAME") {
        return new Error(
            `Invalid call to doTurn, current state is ${this.gameState}`
        );
    }

    if (this.timeoutID) {
        clearTimeout(this.timeoutID);
        this.timeoutID = null
        console.log("stopping turn early")
    }
    
    console.log(`turn of player ${this.currentPlayer == this.playerA ? "A" : "B"}`)

    // send a turn message to the player
    let turnMsg = messages.O_PLAYER_TURN;
    turnMsg.data = this.turns.length;
    this.currentPlayer.send(JSON.stringify(turnMsg))

    // clear all previously turned cards
    this.cardGrid.resetTurned();

    // wait for TURN_TIME to this
    this.timeoutID = setTimeout(() =>{ 

        // send an end of turn message to the player
        let timerRunOutMsg = messages.O_TIMER_RUN_OUT;
        timerRunOutMsg.data = TURN_TIME;
        this.currentPlayer.send(JSON.stringify(timerRunOutMsg))
        this.timeoutID = null;

        this.swapTurn()
    
    }, TURN_TIME);
};

Game.prototype.swapTurn = function() {
    console.log(messages.S_END_TURN)

    this.currentPlayer.send(messages.S_END_TURN)

    console.log(`end of turn of player ${this.currentPlayer == this.playerA ? "A" : "B"}`)

    // swap the current player
    this.currentPlayer = this.currentPlayer == this.playerA ? this.playerB : this.playerA;

    // do new turn
    this.doTurn()
}


Game.prototype.turnCard = function(cardId) {

    // turn the actual card server side
    this.cardGrid.turnCard(cardId);

    // send the turned cards to the current player
    let msg = messages.O_TURNED_CARDS;
    msg.data = {"turnedCards" : null, "newCard": null}
    msg.data.turnedCards = this.cardGrid.turnedCards.map(e => {e.getClientTurnedCard()})
    msg.data.newCard = this.cardGrid.lastTurnedCard;
    console.log(msg)
    // this.currentPlayer.send(JSON.stringify(msg))
    this.playerA.send(JSON.stringify(msg))
    this.playerB.send(JSON.stringify(msg))

    // if 2 cards are turned check for a match
    if (this.cardGrid.turnedCards.length > 1) {
        const isMatch = this.cardGrid.checkTurnedCards()

        // delay checking to see the second card longer.
        if (isMatch) {
            // add score
            this.addScore(10);

            let msg = messages.O_CARD_MATCH
            msg.data = this.cardGrid.turnedCards

            this.playerA.send(JSON.stringify(msg))
            this.playerB.send(JSON.stringify(msg))


            this.cardGrid.resetTurned();
            
            if (this.checkForEnding()) {
                this.end()
            }
        }
        else {
            this.addScore(-1);
            this.currentPlayer.send(messages.S_BAD_MOVE)
            this.swapTurn()

        }

    }
}


Game.prototype.checkForEnding = function() {
    let noMatchLeft = true;
    this.cardGrid.cards.every(element => {
        if (!element.isMatched) {
            noMatchLeft = false;
            return false;
        }
        return true;
    });
    return noMatchLeft;
}

Game.prototype.end = function() {
    console.log("end game")

    if (this.timeoutID) {
        clearTimeout(this.timeoutID);
        this.timeoutID = null
        console.log("stop running timer at ending")
    }

    // stop turn of current player
    this.currentPlayer.send(messages.S_END_TURN)
    this.currentPlayer = null

    let winMsg = messages.O_GAME_WON_BY

    if (this.scoreA > this.scoreB) {
        winMsg.data = "A"
    }
    else if (this.scoreA < this.scoreB){
        winMsg.data = "B"
    }
    else if (this.scoreA === this.scoreB) {
        winMsg.data = "TIE"
    }

    this.playerA.send(JSON.stringify(winMsg))
    this.playerB.send(JSON.stringify(winMsg))

    
        
}

Game.prototype.addScore = function(score) {
    let msg = messages.O_ADD_SCORE;

    if(this.currentPlayer == this.playerA) {
        this.scoreA += score;
        msg.data = {player: "A", addScore: 10, currentScore: this.scoreA}
    }
    else if(this.currentPlayer == this.playerB) {
        this.scoreB += score;
        msg.data = {player: "B", addScore: 10, currentScore: this.scoreB}
    }

    this.playerA.send(JSON.stringify(msg))
    this.playerB.send(JSON.stringify(msg))
}


Game.prototype.start = function(cardData) {
    /*
    * once we have two players and they are ready, there is no way back;
    * a new Game object is created;
    * if a player now leaves, the Game is aborted (player is not preplaced)
    */
    if (this.gameState != "2 PLAYERS") {
        return new Error(
            `Invalid call to start, current state is ${this.gameState}`
        );
    }  
    console.log(`starting Game ${this.id}...`)

    this.cardGrid = new CardGrid(cardData);

    // send the initial game board to the players. TODO: can this be omitted? It only needs to send ids like "card-1"
    let msg = messages.O_MEMORY_BOARD;
    msg.data = cardData;
    this.playerA.send(JSON.stringify(msg));
    this.playerB.send(JSON.stringify(msg));

    this.setStatus("PRE-GAME") // TODO: maybe add a count down timer 3... 2... 1... GO!
    
    // set the game status to in game
    this.setStatus("IN-GAME")

    // set the first player (playerA) as current player
    this.currentPlayer = this.playerA;

    // do the first turn
    this.doTurn();
}
  

module.exports = Game;
