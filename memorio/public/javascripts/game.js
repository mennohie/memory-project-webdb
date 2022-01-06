// @ts-check




function Game(id, cardGrid, playerA, playerB) {
    this.id = id;
    this.winner = null;

    this.playerA = playerA;
    this.playerB = playerB;
    this.turns = [];

    this.cardGrid = this.cardGrid;

    this.playing = null;
    this.timer = null;
  
    this.doTurn = function() {
        
        // start timer with n secs


        


        // 

        if(this.playing === playerA){
            this.playing = playerB
        }
        if(this.playing === playerB){
            this.playing = playerA
        }
    };





    this.getID = function () {
      return this.getID();
    };
    this.setID = function (id) {
      this.id = id;
    };

    


  }