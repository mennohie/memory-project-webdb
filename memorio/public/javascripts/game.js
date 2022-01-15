// eslint-disable-next-line no-unused-vars
class Game {
  constructor (id, socket) {
    this.id = id
    this.winner = null
    this.playerType = null
    this.turns = []
    this.scoreA = 0
    this.scoreB = 0
    this.currentPlayer = null

    this.setCardGrid = function (cardGrid) {
      this.cardGrid = cardGrid
    }

    this.setPlayerA = function (player) {
      this.playerA = player
    }

    this.setPlayerB = function (player) {
      this.playerB = player
    }

    this.setBoardState = function (boardState) {
      this.cardGrid.setState(boardState.cardGrid.cards)
    }
  }
}
