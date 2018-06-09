
const path = require("path");

/* Managing the loaded world, its entities, and physics
 * The GameClient will use this class for rendering/etc
 * The GameServer will use it for calculations (no rendering)
 * Physics will be separated into a web worker to speed everything up
*/

class WorldAndPhysics {
    constructor () {
        this.pathToWorker = path.resolve(__dirname,"./PhysicsWorker.js");
        console.log(this.pathToWorker);
        this.physicsworker = new Worker(this.pathToWorker);
        this.physicsworker.onerror = (err)=> {
            console.log("Error", err);
        }
        this.physicsworker.onmessage = (msg)=>{
            console.log("[WorldAndPhysics] Worker says:", msg.data);
        }
        this.physicsworker.postMessage("Hello from WorldAndPhysics");
    }
}

module.exports = WorldAndPhysics;