// @ts-nocheck

(function (exports) {
    /*
     * Client to server: game is complete, the winner is ...
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
      type: exports.T_GAME_WON_BY,
      data: null,
    };
  
    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.O_GAME_ABORTED = {
      type: "GAME-ABORTED",
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);


    /*
     * Client to server: start new turn
     */
    exports.O_START_TURN = "START-TURN";
 
    /*
     * Server to client: init game 
     */
    exports.T_INIT_GAME = "INIT-GAME";
    exports.O_INIT_GAME = {
      type: exports.T_INIT_GAME,
      data: null,
    };
  //exports.S_INIT_GAME does not exist, as we always need to fill the data property

  
    /*
     * Server to client: set as player A
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {
      type: exports.T_PLAYER_TYPE,
      data: "A",
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);
  
    /*
     * Server to client: set as player B
     */
    exports.O_PLAYER_B = {
      type: exports.T_PLAYER_TYPE,
      data: "B",
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

  
    /*
     * Server to Player A & B: game over with result won/loss
     */
    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
      type: exports.T_GAME_OVER,
      data: null,
    };
  })(typeof exports === "undefined" ? (this.Messages = {}) : exports);
  //if exports is undefined, we are on the client; else the server