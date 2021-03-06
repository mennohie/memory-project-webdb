/* eslint-disable no-undef */
/**
 * set everything up, including the WebSocket
 */
(function setup () {
  // const socket = new WebSocket(Setup.WEB_SOCKET_URL);
  const socket = new WebSocket('ws://' + window.location.host)
  const game = new Game(0, socket)
  const timer = new Timer(100)

  socket.onmessage = function (event) {
    const incomingMsg = JSON.parse(event.data)

    // set game data
    if (incomingMsg.type === Messages.T_MEMORY_BOARD) {
      const cards = createCards(incomingMsg.data)
      const cardGrid = new CardGrid(cards, socket)
      game.setCardGrid(cardGrid)
    }

    // set player type
    if (incomingMsg.type === Messages.T_PLAYER_TYPE) {
      console.log(incomingMsg)
      game.playerType = incomingMsg.data
      document.getElementById('player-type').innerHTML = 'You are player: ' + incomingMsg.data

      if (incomingMsg.data === 'A') {
        console.log('you are the first player! (A)')
      }
    }

    if (incomingMsg.type === Messages.T_PLAYER_READY) {
      console.log(incomingMsg + ` Player ${incomingMsg.data}$ Is Ready`)
      if (incomingMsg.data === 'A') {
        game.readyA = true
        if (game.playerType === 'A') {
          document.getElementById('ready-you').innerHTML = 'You are ready'
        } else if (game.playerType === 'B') {
          document.getElementById('ready-other').innerHTML = 'Other player ready'
        }
      } else if (incomingMsg.data === 'B') {
        game.readyB = true
        if (game.playerType === 'B') {
          document.getElementById('ready-you').innerHTML = 'You are ready'
        } else if (game.playerType === 'A') {
          document.getElementById('ready-other').innerHTML = 'Other player ready'
        }
      }
    }

    if (incomingMsg.type === Messages.T_TURNED_CARDS) {
      console.log(incomingMsg.data)
      const newCard = incomingMsg.data.newCard
      game.cardGrid.turnOverCard(newCard.id, newCard.image, newCard.text)
    }

    if (incomingMsg.type === Messages.T_PLAYER_TURN) {
      game.cardGrid.reset()

      document.getElementById('player-turn').innerHTML = 'Your turn'
      game.cardGrid.setActivePlayer(true)
    }

    if (incomingMsg.type === Messages.T_TIMER_RUN_OUT || incomingMsg.type === Messages.T_BAD_MOVE) {
      console.log(incomingMsg)
    }

    if (incomingMsg.type === Messages.T_END_TURN) {
      console.log(incomingMsg)
      game.cardGrid.reset()

      document.getElementById('player-turn').innerHTML = 'Other Player turn'
      game.cardGrid.setActivePlayer(false)

      const incorrectSound = document.getElementById('incorrect-sound')
      incorrectSound.pause()
      incorrectSound.currentTime = 0
      incorrectSound.play()
    }

    if (incomingMsg.type === Messages.T_SET_TIMER) {
      timer.stop();
      timer.set(5000);
      timer.start();
    }

    if (incomingMsg.type === Messages.T_CARD_MATCH) {
      game.cardGrid.matchCards(incomingMsg.data)
      const correctSound = document.getElementById('correct-sound')
      correctSound.pause()
      correctSound.currentTime = 0
      correctSound.play()
    }

    if (incomingMsg.type === Messages.T_ADD_SCORE) {
      console.log(incomingMsg)
      if (incomingMsg.data.player === 'A') {
        game.scoreA = incomingMsg.data.currentScore
        if (game.playerType === 'A') {
          document.getElementById('your-score').innerHTML = `${incomingMsg.data.currentScore}`
          // If the current score is higher than the highscore, also increase personal best
          if (game.scoreA > parseInt(getCookie('highScore'))) {
            setCookie('highScore', game.scoreA, 1825)
          }
        } else if (game.playerType === 'B') {
          document.getElementById('other-score').innerHTML = `${incomingMsg.data.currentScore}`
        }
      } else if (incomingMsg.data.player === 'B') {
        game.scoreB = incomingMsg.data.currentScore
        if (game.playerType === 'B') {
          document.getElementById('your-score').innerHTML = `${incomingMsg.data.currentScore}`
          // If the current score is higher than the highscore, also increase personal best
          if (game.scoreB > parseInt(getCookie('highScore'))) {
            functions.setCookie('highScore', game.scoreA, 1825)
          }
        } else if (game.playerType === 'A') {
          document.getElementById('other-score').innerHTML = `${incomingMsg.data.currentScore}`
        }
      }
    }

    if (incomingMsg.type === Messages.T_GAME_WON_BY) {
      overlapCss = document.getElementById('server-info')
      overlapCss.hidden = false
      overlapCss.style.border = '3px solid green'

      document.getElementById('server-info').innerHTML = `Game won by: ${incomingMsg.data}. Congratulations!`
      // TODO: add something like this:
      timer.set(0);
      timer.stop();
      document.getElementById('timer').innerHTML = "Finished!";
    }

    if (incomingMsg.type === Messages.T_FOUND_GAME) {
      console.log(incomingMsg)
      ready = document.getElementById('ready')
      finding = document.getElementById('finding')
      finding.classList.add('hidden')
      ready.classList.remove('hidden')
    }

    if (incomingMsg.type === Messages.T_GAME_ABORTED) {
      serverinfo = document.getElementById('server-info')
      serverinfo.innerHTML = 'Game Aborted.'
    }
  }

  document.getElementById('ready').onclick = function () {
    const msg = Messages.O_PLAYER_READY
    msg.data = game.playerType
    socket.send(JSON.stringify(msg))
  }

  socket.onopen = function () {

  }

  // server sends a close event only if the game was aborted from some side
  socket.onclose = function () {
  }

  socket.onerror = function () {}
})() // execute immediately
