
(function (exports) {
  /*
   * Server to client: game is complete, the winner is ...
   */
  exports.T_GAME_WON_BY = 'GAME-WON-BY'
  exports.O_GAME_WON_BY = {
    type: exports.T_GAME_WON_BY,
    data: null
  }

  /*
   * Client to server: player A | B is ready
   */
  exports.T_PLAYER_READY = 'PLAYER-READY'
  exports.O_PLAYER_READY = {
    type: exports.T_PLAYER_READY,
    data: null
  }

  /*
   * Server to client: abort game (e.g. if second player exited the game)
   */
  exports.T_GAME_ABORTED = 'GAME-ABORTED'
  exports.O_GAME_ABORTED = {
    type: exports.T_GAME_ABORTED
  }
  exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED)

  /*
   * Server to client: set as player A
   */
  exports.T_PLAYER_TYPE = 'PLAYER-TYPE'
  exports.O_PLAYER_TYPE = {
    type: exports.T_PLAYER_TYPE,
    data: null
  }
  exports.S_PLAYER_A = JSON.stringify({
    type: exports.T_PLAYER_TYPE,
    data: 'A'
  })
  exports.S_PLAYER_B = JSON.stringify({
    type: exports.T_PLAYER_TYPE,
    data: 'B'
  })

  exports.T_FOUND_GAME = 'FOUND-GAME'
  exports.O_FOUND_GAME = {
    type: exports.T_FOUND_GAME
  }
  exports.S_FOUND_GAME = JSON.stringify(exports.O_FOUND_GAME)

  exports.T_PLAYER_TURN = 'PLAYER-TURN'
  exports.O_PLAYER_TURN = {
    type: exports.T_PLAYER_TURN,
    data: null
  }

  /*
   * Server to client: Timer has run out
   */
  exports.T_TIMER_RUN_OUT = 'TIMER-RUN-OUT'
  exports.O_TIMER_RUN_OUT = {
    type: exports.T_TIMER_RUN_OUT,
    data: null
  }

  /*
   * Server to Player A & B: game over with result won/loss
   */
  exports.T_GAME_OVER = 'GAME-OVER'
  exports.O_GAME_OVER = {
    type: exports.T_GAME_OVER,
    data: null
  }

  /*
   * Player A | B to Server: Which card has been turned around
   */
  exports.T_CARD_TURNED = 'CARD-TURNED'
  exports.O_CARD_TURNED = {
    type: exports.T_CARD_TURNED,
    data: null // card id
  }

  exports.T_TURNED_CARDS = 'TURNED-CARDS'
  exports.O_TURNED_CARDS = {
    type: exports.T_TURNED_CARDS,
    data: null // [card id, ...]
  }

  exports.T_ADD_SCORE = 'ADD-SCORE'
  exports.O_ADD_SCORE = {
    type: exports.T_ADD_SCORE,
    data: null // to who (A/B) and how much.
  }

  exports.T_BAD_MOVE = 'BAD-MOVE'
  exports.O_BAD_MOVE = {
    type: exports.T_BAD_MOVE
  }
  exports.S_BAD_MOVE = JSON.stringify(exports.O_BAD_MOVE)

  exports.T_END_TURN = 'END-TURN'
  exports.O_END_TURN = {
    type: exports.T_END_TURN
  }
  exports.S_END_TURN = JSON.stringify(exports.O_END_TURN)

  /*
   * Server to Player A & B: Generated memory board
   */
  exports.T_MEMORY_BOARD = 'MEMORY-BOARD'
  exports.O_MEMORY_BOARD = {
    type: exports.T_MEMORY_BOARD,
    data: null
  }

  exports.T_GAME_STATE = 'GAME-STATE'
  exports.O_GAME_STATE = {
    type: exports.T_GAME_STATE,
    data: null
  }

  exports.T_CARD_MATCH = 'CARD-MATCH'
  exports.O_CARD_MATCH = {
    type: exports.T_CARD_MATCH,
    data: null
  }
})(typeof exports === 'undefined' ? (this.Messages = {}) : exports)
// if exports is undefined, we are on the client; else the server
