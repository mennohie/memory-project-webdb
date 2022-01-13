const game = require("../../game");



//set everything up, including the WebSocket
(function setup() {

    // const socket = new WebSocket(Setup.WEB_SOCKET_URL);
    const socket = new WebSocket("ws://localhost:3000");
    game = new Game(0, socket);

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);

        console.log(incomingMsg);

        // set game data
        if (incomingMsg.type == Messages.T_MEMORY_BOARD) {
            console.log(incomingMsg.data);

            cards = createCards(incomingMsg.data);
            cardGrid = new CardGrid(cards, socket);
            game.setCardGrid(cardGrid)
            game.start();
        }

        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            console.log(incomingMsg)
            game.playerType = incomingMsg.data;
            document.getElementById("current-player").innerHTML = "You are player: " + incomingMsg.data;

            if (incomingMsg.data === "A") {
                console.log("you are the first player! (A)")
            }
        }

        if (incomingMsg.type == Messages.T_PLAYER_READY){
          console.log(incomingMsg + ` Player ${incomingMsg.data}$ Is Ready`)
          if (incomingMsg.data == "A") {
            game.readyA = true;
            document.getElementById("ready-a").innerHTML = `Player A is ready`;
          }
          else if (incomingMsg.data == "B") {
            game.readyB = true;
            document.getElementById("ready-b").innerHTML = `Player B is ready`;
          }
        }

        if (incomingMsg.type == Messages.T_PLAYER_TURN) {
          document.getElementById("player-turn").innerHTML = "Your turn";
          game.refreshGameState()
        }

        if (incomingMsg.type == Messages.T_TIMER_RUN_OUT) {
          document.getElementById("player-turn").innerHTML = "other turn";
        }
    };

    document.getElementById("ready").onclick = function(){
      let msg = Messages.O_PLAYER_READY
      msg.data = game.playerType
      socket.send(JSON.stringify(msg));
    }

    socket.onopen = function () {
        
    };

    //server sends a close event only if the game was aborted from some side
    socket.onclose = function () {

    };

    socket.onerror = function () {};


  })(); //execute immediately
