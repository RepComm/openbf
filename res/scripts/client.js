const THREE = require("three");
const OBJLoader = require("./OBJLoader.js")(THREE);
const Scene = THREE.Scene;
const PerspectiveCamera = THREE.PerspectiveCamera;
const WebGLRenderer = THREE.WebGLRenderer;
const DirectionalLight = THREE.DirectionalLight;

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
        this.camera.position.z = 10;
        console.log(this.camera);
        
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(this.domRect.width, this.domRect.height);
        this.domContainer.appendChild(this.renderer.domElement);

        this.physicsworld = new CANNON.World();
        this.physicsworld.gravity.set(0, 0, -9.82); // m/s²
        
        this.physicsworld.broadphase = new CANNON.NaiveBroadphase();

        this.objloader = new OBJLoader();
        this.objloader.load(
            "res/models/trooper_helmet.obj",
            ( object )=> {
                this.scene.add( object );
                this.trooper_helmet = object;
                console.log("Added", object);
            },
            function ( xhr ) {
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
                console.log("Couldn't load the OBJ model..");
            }
        );

        this.dirlight = new DirectionalLight(0xffffff, 0.5);
        this.scene.add(this.dirlight);
        this.dirlight.position.setZ(5);

        /*let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        let cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );*/

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
        //console.log(this.physicsworld);
        //ENDTEST
        
        this.updatesPerSecond = 30; //How many times to fire a loop iteration per second
        this.resolutionPerSecond = 1000; //Milliseconds
        this.timeBetweenUpdates = this.resolutionPerSecond/this.updatesPerSecond;
        this.timeEnlapsed = 0; //Enlapsed time since last loop iteration
        this.timeNow = 0; //Current time
        this.timeDelta = 0;
        this.timeLast = 0;
        this.secondTimer = 0;

        this.updates = 0;
        
        window.addEventListener("resize", ()=>this.onResize());
        
        this.onAnimationFrameCallback = ()=>this.onAnimationFrame();
        
        window.requestAnimationFrame(this.onAnimationFrameCallback);
    }
    onUpdate () {
        this.timeDelta = this.timeEnlapsed / this.timeBetweenUpdates;
        
        //TODO: Logic here
        this.updates++;
        this.frameRate++;
        this.secondTimer += this.timeEnlapsed;
        if (this.secondTimer >= this.resolutionPerSecond) {
            this.secondTimer = 0;
            document.title ="FPS:" + this.frameRate;
            this.frameRate = 0;
        }
        //console.log(this.sphereBody.position.z);
        if (this.trooper_helmet) {
            this.trooper_helmet.rotation.y += 0.025;
        }
        //This is being funky.. Physics can be simulated, but slows down in velocity. At least it isn't laggy.
        this.physicsworld.step(1/60, this.timeEnlapsed, 5);
        
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