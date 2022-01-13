


function Timer (seconds) {
    this.element = document.getElementById("timer");

    this.ms = seconds * 1000;
    this.currentMs = this.ms;
    this.timeStep = 100;
    

    this.start = function () {


        // Update the count down every 1 second
        var interval = setInterval(() => {
            console.log(this.element)

            this.updateTimer()
        
            // If the count down is finished, write some text
            if (this.currentMs < 0) {
                clearInterval(interval);
                    this.element.innerText = "Done";
            }
        }, this.timeStep);
    };

    this.updateTimer = function () {
        this.currentMs -= this.timeStep;
            
        this.element.innerText = Math.floor(this.currentMs / 1000) + " : " + this.currentMs % 1000;
    }

    this.isDone = function () {
        return this.currentMs < 0;
    }
}