// const game = require("../../game");

playerB = new Player(66721, "tom");
playerA = new Player(32132, "pip");

//set everything up, including the WebSocket
(function setup() {

    // const socket = new WebSocket(Setup.WEB_SOCKET_URL);
    const socket = new WebSocket("ws://localhost:3000");
    game = new Game(0, socket);

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);

        console.log(incomingMsg);

        // set game data
        if (incomingMsg.type == Messages.T_INIT_GAME) {
            console.log(incomingMsg.data);

            cards = createCards(incomingMsg.data);
            cardGrid = new cardGrid(cards);
            game.setCardGrid(cardGrid)
            game.start();
        }

        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            console.log(incomingMsg)
            game.playerType = incomingMsg.data;

            if (incomingMsg.data === "A") {
                console.log("you are the first player!")
            }
        }

        if (incomingMsg.type == Messages.T_PLAYER_A_READY){
          console.log(incomingMsg + " Player A Is Ready")
          game.readyA = true;
        }

        if (incomingMsg.type == Messages.T_PLAYER_B_READY){
          console.log(incomingMsg + " Player B is ready")
          game.readyB = true;
        }
    };

    document.getElementById("ready").onclick = function(){
      game.playerType == "A" ? socket.send(Messages.T_PLAYER_A_READY) : socket.send(Messages.T_PLAYER_B_READY);
    }

    socket.onopen = function () {
        socket.send(game.getPlayerType);
    };

    //server sends a close event only if the game was aborted from some side
    socket.onclose = function () {

    };

    socket.onerror = function () {};


  })(); //execute immediately
