
const ROTATE_CLASS_NAME = 'rotate'
const BACKFACE_IMAGE = `images/brainlogo.png`
const DELAY_IN_MS = 300;

function frontfaceImage(id) {
    return `images/${id}.png`
}

function Card(id) {
    this.id = id;
    this.isMatched = false;
    this.isTurned = false;

    this.element = document.createElement('div');
    this.element.id = id;

    this.imgElement = document.createElement('img');
    this.imgElement.setAttribute('width', '100%');
    this.imgElement.src = BACKFACE_IMAGE;

    this.turnOver = function (image, text) {
        if ( !this.isTurned ){
            this.element.classList.add(ROTATE_CLASS_NAME)
            this.imgElement.src = frontfaceImage(image);
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
    
   /* 
    * creates an element of form
    * 
    * <div class="grid-item">
    *     <img src="images/3.png" width="100%" />
    * </div>
    */ 
    this.render = function() {
        this.element.classList.add('card');        
        this.element.appendChild(this.imgElement);
        return this.element
    }
}

function createCards(cardData) {
    let cards = [];
    cardData.forEach(element => {
        cards.push(
            new Card(element.id)
        );
    });
    return cards;
}


function CardGrid(cards, socket) {
    this.cards = cards
    this.cardGridElement = document.getElementById('card-grid')
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

            // find the card by id in the cards array and turn it over
            cardId = e.target.parentElement.id
            this.cards.every(element => {
                if(element.getId() === cardId) {

                    // find all turned cards
            this.turnedCards = []
            this.cards.forEach(element => {
                if(element.isTurned) {
                    this.turnedCards.push(element)
                }
            });

            // send a message of the newly turned card and the previously listed turned cards
            let msg = Messages.O_CARD_TURNED;
            msg.data = {"cardId" : cardId, "turnedCards" : turnedCards}
            socket.send(JSON.stringify(msg))




                    return false;
                }
                return true;
            });



        }
    }.bind(this)


    // this.turnedCards.forEach(element => {
    //     element.isMatched = true;
    //     element.turnOver();
    // })
}