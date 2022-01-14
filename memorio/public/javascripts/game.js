const GameState = function (gameID) {
    this.id = gameID;
    this.timeElapsed = 0;
    this.turns = [];
    this.currentPlayer = null;
    this.playerA = null;
    this.playerB = null;
    this.readyA = false;
    this.readyB = false;
    this.cardGrid = null;
}

function Game(id, socket) {
    this.id = id;
    this.winner = null;
    this.playerType = null;
    this.turns = [];
    this.scoreA = 0;
    this.scoreB = 0;
    


    this.currentPlayer = null


    this.setCardGrid = function (cardGrid) {
        this.cardGrid = cardGrid;
    }

    this.setPlayerA = function (player) {
        this.playerA = player;
    }

    this.setPlayerB = function (player) {
        this.playerB = player;
    }

    this.setBoardState = function (boardState) {
        this.cardGrid.setState(boardState.cardGrid.cards)
    }

  }
