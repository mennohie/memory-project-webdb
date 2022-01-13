

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


    this.currentPlayer = null
    this.timer = new Timer(2);


    this.setCardGrid = function (cardGrid) {
        this.cardGrid = cardGrid;
    }

    this.setPlayerA = function (player) {
        this.playerA = player;
    }

    this.setPlayerB = function (player) {
        this.playerB = player;
    }

    this.doTurn = function() {

        // start timer with n secs
        this.timer.start();

        this.cardGrid.setActivePlayer(this.currentPlayer == playerA)

        if(this.currentPlayer == playerA){
            this.currentPlayer = playerB
        }
        else if(this.currentPlayer == playerB){
            this.currentPlayer = playerA
        }
    };

    this.start = function () {
        this.currentPlayer = playerA;
        window.requestAnimationFrame(() => {this.loop();})
    }

    this.loop = function () {
        this.cardGrid.reset();
        if(this.readyA){
          document.getElementById('ready-a').innerHTML = "Player A is ready!";
        }
        if(this.readyB){
          document.getElementById('ready-b').innerHTML = "Player B is ready!";
        }
        this.doTurn();
        setTimeout(() => {
              window.requestAnimationFrame(
                () => {this.loop();}
            );
        }, 2000);
    }

    this.refreshGameState = function (gameState) {
        
    }

  }
