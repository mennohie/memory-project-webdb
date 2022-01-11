



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
        let currentPlayerElement = document.getElementById('current-player')
        currentPlayerElement.innerText = "current player: " + this.currentPlayer.name;
        this.doTurn();
        setTimeout(() => {
              window.requestAnimationFrame(
                () => {this.loop();}
            );
        }, 2000);

    }

  }