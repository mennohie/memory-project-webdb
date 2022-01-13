
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
   exports.T_GAME_ABORTED = "GAME-ABORTED"
  exports.O_GAME_ABORTED = {
    type: exports.T_GAME_ABORTED,
  };
  exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

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
   * Server to client: Timer has run out
   */
  exports.T_TIMER_RUN_OUT = "TIMER-RUN-OUT"
  exports.O_TIMER_RUN_OUT = {
    type: exports.T_TIMER_RUN_OUT,
    data: null,
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

  /*
   * Player A | B to Server: Which card has been turned around
   */
  exports.T_CARD_TURNED = "CARD-TURNED"
  exports.O_CARD_TURNED = {
    type: exports.T_CARD_TURNED,
    data: null
  };

  /*
   * Server to Player A & B: Generated memory board
   */
  exports.T_MEMORY_BOARD = "MEMORY-BOARD"
  exports.O_MEMORY_BOARD = {
    type: exports.T_MEMORY_BOARD,
    data: null
  };


  /*
   *
   */
  exports.T_GAME_STATE = "GAME-STATE"
  exports.O_GAME_STATE = {
    type: exports.T_GAME_STATE,
    data: null
  }




})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
//if exports is undefined, we are on the client; else the server
