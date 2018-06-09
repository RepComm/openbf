
const path = require("path");

/* Managing the loaded world, its entities, and physics
 * The GameClient will use this class for rendering/etc
 * The GameServer will use it for calculations (no rendering)
 * Physics will be separated into a web worker to speed everything up
*/

class WorldAndPhysics {
    constructor () {
        this.pathToWorker = path.resolve(__dirname,"./PhysicsWorker.js");

        this.physicsworker = new Worker(this.pathToWorker);

        this.canStepPhysics = false;

        this.physicsworker.onerror = (err)=> {
            console.log("Error", err);
        }
        this.physicsworker.onmessage = (msg)=>{
            //console.log("PhysicsWorker", msg.data.type);
            if (msg.data.type == "loadscriptfinished") {
                this.physicsworker.postMessage({type:"start"});
            }
            if (msg.data.type == "startfinished") {
                this.canStepPhysics = true;
            }
        }
        this.physicsworker.postMessage({
            type:"loadscript",
            scripturl:"../../../node_modules/cannon/build/cannon.js"
        });
    }

    stepPhysics (deltaTime) {
        if (this.canStepPhysics) {
            this.physicsworker.postMessage({type:"step",deltaTime:deltaTime});
        }
    }
}

module.exports = WorldAndPhysics;