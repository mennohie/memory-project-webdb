
// eslint-disable-next-line no-unused-vars
class Timer {
  constructor (timeStep) {
    this.element = document.getElementById('timer')
    this.timeStep = timeStep
    this.intervalID = null

    this.start = function () {
      if (this.intervalID) {
        this.stop()
      }

      // Update the count down every timestep
      this.intervalID = setInterval(() => {
        this.updateTimer()

        // If the count down is finished, write some text
        if (this.currentMs < 0) {
          this.element.innerText = 'OVERTIME'
        }
      }, this.timeStep)
    }

    this.updateTimer = function () {
      this.currentMs -= this.timeStep
      this.element.innerText = "0" + Math.floor(this.currentMs / 1000) + ':' + (this.currentMs % 1000)/100 + "00";
    }

    this.stop = function () {
      clearInterval(this.intervalID)
      this.intervalID = null
    }

    this.set = function (ms) {
      this.currentMs = ms
    }

    this.isDone = function () {
      return this.currentMs < 0
    }
  }
}
