
const Card = function(id, image, text, matchId) {
    this.id = id;
    this.matchId = matchId;
    this.text = text;
    this.image = image;
    this.isMatched = false;
    this.isTurned = false;
}


Card.prototype.getClientCard = function() {
    return {"id": this.id, "image": this.isMatched ? this.image : null, "text": this.isMatched ? this.text : null, "isMatched" : this.isMatched}
}

Card.prototype.getClientTurnedCard = function() {
    return {"id": this.id, "image": this.image, "text": this.text, "matchId" : this.matchId}
}

module.exports = Card