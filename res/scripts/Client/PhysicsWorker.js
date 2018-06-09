
/* Physics worker for server and client purposes
 * Following https://raw.githubusercontent.com/schteppe/cannon.js/master/examples/worker.html
 * After implementation, I will switch this over to /Shared so it can be used for server and client
*/

let cannonLoaded = false;
let started = false;
let physicsWorld = undefined;
let positions = [];
let rotations = [];

function startPhysics (gravity=10) {
    if (started) {
        self.postMessage({type:"error",data:"Physics already started! send a type:'stop' message first"});
        return;
    }
    started = true;
    physicsWorld = new CANNON.World();
    physicsWorld.broadphase = new CANNON.NaiveBroadphase();
    physicsWorld.gravity.set(0,gravity,0);
    physicsWorld.solver.tolerance = 0.001;

    self.postMessage({
        type:"startfinished"
    });

}

function stepPhysics (deltaTime) {
    physicsWorld.step(deltaTime);

    if (positions.length > 0 && rotations.length > 0) {
        self.postMessage({
            type:"stepfinished",
            positions:positions,
            rotations:rotations
        });
    }
}

self.onmessage = (msg)=> {
    switch (msg.data.type) {
        case "loadscript":
            importScripts(msg.data.scripturl);
            if (CANNON && !cannonLoaded) cannonLoaded=true;
            self.postMessage({
                type:"loadscriptfinished"
            });
            break;
        case "start":
            startPhysics(msg.data.gravity);
            break;
        case "step":
            stepPhysics(msg.data.deltaTime);
            break;
    }
}
