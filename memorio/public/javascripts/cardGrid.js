/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const ROTATE_CLASS_NAME = 'rotate'
const BACKFACE_IMAGE = 'images/brainlogo.png'

function frontfaceImage (id) {
  return `images/${id}.png`
}

function Card (id) {
  this.id = id
  this.isMatched = false
  this.isTurned = false
  this.text = null
  this.image = null

  this.element = document.createElement('div')
  this.element.id = id

  this.imgElement = document.createElement('img')
  this.imgElement.setAttribute('width', '100%')
  this.imgElement.src = BACKFACE_IMAGE

  this.turnOver = function (image, text) {
    if (!this.isMatched) {
      if (!this.isTurned && image != null && text != null) {
        // turn front
        this.element.classList.add(ROTATE_CLASS_NAME)
        this.imgElement.src = frontfaceImage(image)
      } else {
        // turn back
        this.element.classList.remove(ROTATE_CLASS_NAME)
        this.imgElement.src = BACKFACE_IMAGE
      }
      this.isTurned = !this.isTurned
      return this.isTurned
    } else {
      this.element.classList.add(ROTATE_CLASS_NAME)
      this.imgElement.src = frontfaceImage(this.image)
    }
    return this.isMatched
  }

  this.reset = function () {
    this.isTurned = false
    if (this.isMatched) {
      this.element.classList.add(ROTATE_CLASS_NAME)
      this.imgElement.src = frontfaceImage(this.image)
    } else {
      // turn back
      this.element.classList.remove(ROTATE_CLASS_NAME)
      this.imgElement.src = BACKFACE_IMAGE
    }
  }

  this.render = function () {
    this.element.classList.add('card')
    this.element.appendChild(this.imgElement)
    return this.element
  }
}

function createCards (cardData) {
  const cards = []
  cardData.forEach(element => {
    cards.push(
      new Card(element.id)
    )
  })
  return cards
}

class CardGrid {
  constructor (cards, socket) {
    this.cards = cards
    this.cardGridElement = document.getElementById('card-grid')
    this.turnedCards = []
    this.isActivePlayer = false

    this.cards.forEach(element => {
      this.cardGridElement.appendChild(
        element.render()
      )
    })

    this.setActivePlayer = function (isActive) {
      this.isActivePlayer = isActive
    }

    this.reset = function () {
      this.cards.forEach(element => {
        element.reset()
      })
    }

    this.turnOverCard = function (cardId, image, text) {
      this.cards.every(element => {
        if (element.id === cardId) {
          element.turnOver(image, text)
          return false
        }
        return true
      })
    }

    this.cardGridElement.onclick = function (e) {
      if (this.isActivePlayer) {
        // find the card by id in the cards array and turn it over
        const cardId = e.target.parentElement.id
        this.cards.every(element => {
          if (element.id === cardId) {
            const msg = Messages.O_CARD_TURNED
            msg.data = { cardId: cardId }
            console.log(msg)
            socket.send(JSON.stringify(msg))

            return false
          }
          return true
        })
      }
    }.bind(this)

    this.setState = function (cards) {
      cards.forEach(c => {
        if (c.isMatched) {
          this.cards.forEach(card => {
            if (card.id === c.id) {
              card.isMatched = c.isMatched
              card.text = c.text
              card.image = c.image
            }
          })
        }
      })
    }

    this.matchCards = function (turnedCards) {
      turnedCards.forEach(c => {
        if (c.isMatched) {
          this.cards.forEach(card => {
            if (card.id === c.id) {
              card.isMatched = c.isMatched
              card.text = c.text
              card.image = c.image
            }
          })
        }
      })
    }
  }
}
