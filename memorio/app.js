// @ts-check

const express = require("express");
const http = require("http");
const websocket = require("ws");
const messages = require("./public/javascripts/messages");
const port = process.argv[2];
const app = express();
const gameStatus = require("./gameStats");
const Game = require("./game");

if (process.argv.length < 3) {
  console.log("Usage: node app.js <port>");
  process.exit(1);
}

app.use(express.static(__dirname + "/public"));

const server = http.createServer(app);
const wss = new websocket.Server({ server });
const websockets = {}; //property: websocket, value: game
const openGames = [];

let currentGame = new Game(gameStatus.gamesInitialized++);
let connectionID = 0; //each websocket receives a unique ID

// for testing
const cardData = [
  {id : 'card-0', image: 0, text: "bladiebla #1", matchId: 0},
  {id : 'card-1', image: 1, text: "bladiebla #2", matchId: 1},
  {id : 'card-2', image: 2, text: "bladiebla #3", matchId: 2},
  {id : 'card-3', image: 3, text: "bladiebla #4", matchId: 3},
  {id : 'card-4', image: 4, text: "bladiebla #5", matchId: 4},
  {id : 'card-5', image: 5, text: "bladiebla #6", matchId: 5},
  {id : 'card-6', image: 6, text: "bladiebla #7", matchId: 6},
  {id : 'card-7', image: 7, text: "bladiebla #8", matchId: 7},
  {id : 'card-8', image: 0, text: "bladiebla #1", matchId: 0},
  {id : 'card-9', image: 1, text: "bladiebla #2", matchId: 1},
  {id : 'card-10', image: 2, text: "bladiebla #3", matchId: 2},
  {id : 'card-11', image: 3, text: "bladiebla #4", matchId: 3},
  {id : 'card-12', image: 4, text: "bladiebla #5", matchId: 4},
  {id : 'card-13', image: 5, text: "bladiebla #6", matchId: 5},
  {id : 'card-14', image: 6, text: "bladiebla #7", matchId: 6},
  {id : 'card-15', image: 7, text: "bladiebla #8", matchId: 7},
];



wss.on("connection", function connection(ws) {
  /*
  * two-player game: every two players are added to the same game
  */
  const con = ws;
  con["id"] = connectionID++;
  if(openGames.length != 0){
    openGames.sort();
    openGames.reverse();
    currentGame = websockets[openGames.pop()];
  }
  else if(currentGame.hasTwoConnectedPlayers() | currentGame.isFinished()){
    currentGame = new Game(gameStatus.gamesInitialized++);
  }
  const playerType = currentGame.addPlayer(con);
  websockets[con["id"]] = currentGame;

  console.log(
    `Player ${con["id"]} placed in game ${currentGame.id} as ${playerType}`
  );

  con.send(playerType == "A" ? messages.S_PLAYER_A : messages.S_PLAYER_B);

  if(currentGame.gameState == "2 PLAYERS") {
    currentGame.playerA.send(messages.S_FOUND_GAME)
    currentGame.playerB.send(messages.S_FOUND_GAME)
  }

  /*
  * message coming in from a player:
  *  1. determine the game object
  *  2. determine the opposing player OP
  *  3. send the message to OP
  */
  con.on("message", function incoming(message) {
    console.log(message.toString())

    const msg = JSON.parse(message.toString());
    currentGame = websockets[con["id"]];

    if (message.toString() != undefined) {

      if(currentGame.gameState == "2 PLAYERS") {
        if(msg.type == messages.T_PLAYER_READY){
          currentGame.readyPlayer(msg.data)
          if(currentGame.readyA && currentGame.readyB && currentGame.hasTwoConnectedPlayers()){
            currentGame.start(cardData)
          }
        }
      }
      else if(currentGame.gameState == "IN-GAME") {
        if(msg.type == messages.T_CARD_TURNED) {
          currentGame.turnCard(msg.data.cardId)
        }
      }
    }
  });

  con.on("close", function(code) {
    /*
    * code 1001 means almost always closing initiated by the client;
    * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
    */
    console.log(`${con["id"]} disconnected ...`);

    if (code == 1001) {
      /*
      * if possible, abort the game; if not, the game is already completed
      */
      const currentGame = websockets[con["id"]];

      if (currentGame.isValidTransition(currentGame.gameState, "ABORTED")) {
        currentGame.setStatus("ABORTED");
        console.log(`Game ${currentGame.id} aborted due to connection ${con["id"]} closing.`);
        gameStatus.gamesAborted++;
        currentGame.playerA.send(messages.S_GAME_ABORTED)
        currentGame.playerB.send(messages.S_GAME_ABORTED)
      } if(currentGame.isValidTransition(currentGame.gameState, "1 PLAYERS")){
        openGames.push(currentGame.id);
        currentGame.setStatus("1 PLAYERS");
      }

      currentGame.removePlayer(con)
    }

  });
});
server.listen(port);

app.get("/", function(req, res){
  res.sendFile("splash.html", {root: "./memorio/public"});
});

app.get("/publicserverdata", function(req, res){
  res.send(gameStatus)
})

app.get("/play", function(req, res){
  res.sendFile("game.html", {root: "./memorio/public"});
});

// Default if route is not known
app.get("/*", function(req, res){
  res.send("404 not found.")
});
