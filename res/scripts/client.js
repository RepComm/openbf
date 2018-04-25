const THREE = require("three");
const Scene = THREE.Scene;
const PerspectiveCamera = THREE.PerspectiveCamera;
const WebGLRenderer = THREE.WebGLRenderer;

const CANNON = require("cannon");

function elem (id) {
    return document.getElementById(id);
}

class Client {
    constructor () {
        this.domContainer = elem("render_container_element");
        this.domRect = this.domContainer.getBoundingClientRect();
        
        this.scene = new Scene();
        
        this.camera = new PerspectiveCamera(
            75, //Field Of View
            this.domRect.width / this.domRect.height, //Aspect ratio
            0.01, //Near clip
            500, //Far clip
        );
        
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(this.domRect.width, this.domRect.height);
        this.domContainer.appendChild(this.renderer.domElement);

        this.physicsworld = new CANNON.World();
        this.physicsworld.gravity.set(0, 0, -9.82); // m/s²
        
        this.physicsworld.broadphase = new CANNON.NaiveBroadphase();



        //TEST
        let sphereBody = new CANNON.Body({
            mass: 5, // kg
            position: new CANNON.Vec3(0, 0, 10), // m
            shape: new CANNON.Sphere(10) //Radius
        });
        this.sphereBody = sphereBody;

        this.physicsworld.addBody(sphereBody);

        let groundBody = new CANNON.Body({
            mass: 0 // mass == 0 makes the body static 
        });
        let groundShape = new CANNON.Plane();
        groundBody.addShape(groundShape);
        this.physicsworld.addBody(groundBody);

        this.maxPhysicsWorldSubsteps = 3;
        console.log(this.physicsworld);
        //ENDTEST
        
        this.updatesPerSecond = 20; //How many times to fire a loop iteration per second
        this.resolutionPerSecond = 1000; //Milliseconds
        this.timeBetweenUpdates = this.resolutionPerSecond/this.updatesPerSecond;
        this.timeEnlapsed = 0; //Enlapsed time since last loop iteration
        this.timeNow = 0; //Current time
        this.timeDelta = 0;
        this.timeLast = 0;

        this.updates = 0;
        
        window.addEventListener("resize", ()=>this.onResize());
        
        /* Using requestAnimationFrame( ()=>this.onAnimationFrame() )
         * means we keep 'this' context as this class, instead of event context.
         * Essentially allowing us to use 'this' keyword within onAnimationFrame function as the Client instance
         * The problem is that we're creating an arrow function every frame, which is a BAD idea.
         * Instead, we'll store the arrow function in a variable and just call it every frame, no recreation!
         * 
         * Eek out any performance you can, maaan. That was fun, and i learned.
         * Yeah yeah I know, "What a nerd"
        */
        this.onAnimationFrameCallback = ()=>this.onAnimationFrame();
        
        window.requestAnimationFrame(this.onAnimationFrameCallback);
    }
    onUpdate () {
        this.timeDelta = this.timeEnlapsed / this.timeBetweenUpdates;
        
        //TODO: Logic here
        this.updates++;
        //console.log(this.sphereBody.position.z);
        
        //This is being funky.. Physics can be simulated, but slows down in velocity. At least it isn't laggy.
        //this.physicsworld.step(1/60, this.timeEnlapsed, 5);
        
        this.renderer.render(this.scene, this.camera);
    }
    onAnimationFrame () {
        this.timeNow = Date.now(); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        //Potentially switch to Performance.now() in future? It may be mitigated in most browsers for securety, we don't like that..
        this.timeEnlapsed = this.timeNow - this.timeLast;

        if (this.timeEnlapsed >= this.timeBetweenUpdates) {
            this.onUpdate();
            this.timeLast = this.timeNow;
        }
        
        window.requestAnimationFrame(this.onAnimationFrameCallback);
    }
    onResize () {
        this.domRect = this.domContainer.getBoundingClientRect();
        this.renderer.setSize(this.domRect.width, this.domRect.height);
        this.camera.aspect = this.domRect.width / this.domRect.height;
        this.camera.updateProjectionMatrix();
    }
}

let client = new Client();