
class LogicClock {
    constructor () {
        this.updatesPerSecond = 30; //How many times to fire a loop iteration per second
        this.resolutionPerSecond = 1000; //Milliseconds
        this.timeBetweenUpdates = this.resolutionPerSecond/this.updatesPerSecond;
        this.timeEnlapsed = 0; //Enlapsed time since last loop iteration
        this.timeNow = 0; //Current time
        this.timeDelta = 0;
        this.timeLast = 0;
        this.secondTimer = 0;

        this.updates = 0;

        this.onAnimationFrameCallback = ()=>this.onFrame();
    }

    start () {
        window.requestAnimationFrame(this.onAnimationFrameCallback);
    }

    onFrame () {
        this.timeNow = Date.now(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        //Potentially switch to Performance.now() in future? It may be mitigated in most browsers for securety, we don't like that..
        this.timeEnlapsed = this.timeNow - this.timeLast;

        if (this.timeEnlapsed >= this.timeBetweenUpdates) {
            this.timeDelta = this.timeEnlapsed / this.timeBetweenUpdates;
            this.onUpdate();
            this.timeLast = this.timeNow;
        }
        
        window.requestAnimationFrame(this.onAnimationFrameCallback);
    }

    onUpdate () {
        //Empty function! Overwrite this in your code
    }
}

module.exports = LogicClock;