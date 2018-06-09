
//const CANNON = require("cannon");

/* Physics worker for server and client purposes
*/

self.onmessage = (msg)=> {
    self.postMessage("[PhysicsWorker] I got: " + msg.data);
}