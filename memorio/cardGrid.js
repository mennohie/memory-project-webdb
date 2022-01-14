// @ts-check
const e = require('express');
const Card = require('./card')

function createCards(cardData) {
    let cards = [];
    cardData.forEach(card => {
        cards.push(
            new Card(card.id, card.image, card.text, card.matchId)
        );
    });
    return cards;
}

const CardGrid = function(cardData) {
    this.cards = createCards(cardData)
    this.turnedCards = []
    this.lastTurnedCard = null;
}

CardGrid.prototype.getClientCardGridState = function() {
    return {
        "cards" : (this.cards.map(e => e.getClientCard())) 
    }
}

CardGrid.prototype.resetTurned = function() {
    this.turnedCards.forEach(e => {
        e.isTurned = false;
    })
    this.turnedCards = []
    this.lastTurnedCard = null;
}


CardGrid.prototype.turnCard = function(cardId) {

    for (let card of this.cards) {
        if (card.id === cardId) {
            this.lastTurnedCard = card;
            if (!card.isTurned) {
                card.isTurned = true;
                this.turnedCards.push(card)   
            }
            else {
                card.isTurned = false;
                var index = this.turnedCards.indexOf(card);
                if (index !== -1) {
                    this.turnedCards.splice(index, 1);
                }
            }
            break;
        }
      }
}
    

CardGrid.prototype.checkTurnedCards = function() {
    if (this.turnedCards.length !== 2) {
        return new Error(`length of turnedCards must be 2, the current length is ${this.checkTurnedCards.length}`)
    }
    if (!this.turnedCards[0].isMatched && !this.turnedCards[1].isMatched) {
        const isMatch = this.turnedCards[0].matchId === this.turnedCards[1].matchId;
 
        if (isMatch) {
            this.turnedCards[0].isMatched = true;
            this.turnedCards[1].isMatched = true;
        }
        return isMatch
    }
    return false;
}

CardGrid.prototype.getTurnedCards = function() {
    return this.turnedCards
}

module.exports = CardGrid