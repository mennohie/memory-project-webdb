
const ROTATE_CLASS_NAME = 'rotate'
const BACKFACE_IMAGE = `images/brainlogo.png`
const DELAY_IN_MS = 300;

function frontfaceImage(id) {
    return `images/${id}.png`
}

function Card(id, image, text, matchId) {
    this.id = id;
    this.matchId = matchId;
    this.text = text;
    this.image = image;
    this.isMatched = false;
    this.isTurned = false;

    this.element = document.createElement('div');
    this.element.id = id;

    // this.element.onclick = function() {
    //     this.turnOver();
    // }.bind(this)

    this.imgElement = document.createElement('img');
    this.imgElement.setAttribute('width', '100%');
    this.imgElement.src = BACKFACE_IMAGE;

    this.turnOver = function () {
        if ( !this.isTurned ){
            this.element.classList.add(ROTATE_CLASS_NAME)
            this.imgElement.src = frontfaceImage(this.image);
        }
        else {
            if(!this.isMatched) {
                this.element.classList.remove(ROTATE_CLASS_NAME)
                this.imgElement.src = BACKFACE_IMAGE;
            }
        }
        this.isTurned = !this.isTurned
        return this.matchId;
    }
    


    // creates an element of form
    // 
    // <div class="grid-item">
    //     <img src="images/3.png" width="100%" />
    // </div>
    this.render = function() {
        this.element.classList.add('card');        
        this.element.appendChild(this.imgElement);
        return this.element
    }

    this.getId = function() {
        return this.id;
    }


}

function createCards(cardData) {
    let cards = [];
    cardData.forEach(element => {
        cards.push(
            new Card(element.id, element.image, element.text, element.matchId)
        );
    });
    return cards;
}


function cardGrid(cards) {
    this.cards = cards
    this.cardGridElement = document.getElementById('card-grid')
    this.toMatchId = null;
    this.turnedCards = []
    this.isActivePlayer = false;

    this.cards.forEach(element => {
        this.cardGridElement.appendChild(
            element.render() 
        );
    });

    this.setActivePlayer = function (isActive) {
        this.isActivePlayer = isActive;
    }

    this.reset = function() {
        this.cards.forEach(element => {
            if(!element.isMatched && element.isTurned) {
                element.turnOver();
            }
        });
    }

    this.cardGridElement.onclick = function(e) {
        if (this.isActivePlayer) {
            cardId = e.target.parentElement.id
            this.cards.every(element => {
                if(element.getId() === cardId) {
                    element.turnOver();
                    return false;
                }
                return true;
            });
            this.getTurnedCards();
        }
    }.bind(this)


    this.getTurnedCards = function() {
        this.turnedCards = []
        this.cards.forEach(element => {
            if(element.isTurned) {
                this.turnedCards.push(element)
            }
        });
        if (this.turnedCards.length === 2) {
            setTimeout(() => {
                this.checkTurnedCards()
              }, DELAY_IN_MS)
        }
    }

    this.checkTurnedCards = function() {
        const isMatch = this.turnedCards[0].matchId === this.turnedCards[1].matchId;
        if (isMatch) {
            console.log("mathc!")
            this.turnedCards.forEach(element => {
                element.isMatched = true;
                element.turnOver();
            })
            return true;
        }
        else {
            console.log("no mathc!")

            this.turnedCards.forEach(element => {
                element.turnOver();
            })
            return false;
        }
    }

}