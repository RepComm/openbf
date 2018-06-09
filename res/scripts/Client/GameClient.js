const THREE = require("three");
const OBJLoader = require("../Shared/OBJLoader")(THREE);
const Scene = THREE.Scene;
const PerspectiveCamera = THREE.PerspectiveCamera;
const WebGLRenderer = THREE.WebGLRenderer;
const DirectionalLight = THREE.DirectionalLight;

const LogicClock = require("../Shared/LogicClock");
const WorldAndPhysics = require("./WorldAndPhysics");

function elem (id) {
    return document.getElementById(id);
}

class GameClient {
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
        
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(this.domRect.width, this.domRect.height);
        this.domContainer.appendChild(this.renderer.domElement);

        this.objloader = new OBJLoader();
        this.objloader.load(
            "res/models/trooper_helmet.obj",
            ( object )=> {
                this.scene.add( object );
                this.trooper_helmet = object;
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
        
        this.clock = new LogicClock();
        this.clock.onUpdate = ()=>this.onUpdate();
        this.clock.start();

        this.worldAndPhysics = new WorldAndPhysics();

        window.addEventListener("resize", ()=>this.onResize());
    }
    onUpdate () {
        this.worldAndPhysics.stepPhysics(this.clock.timeDelta);

        this.updates++;
        this.frameRate++;
        this.secondTimer += this.timeEnlapsed;
        if (this.secondTimer >= this.resolutionPerSecond) {
            this.secondTimer = 0;
            this.frameRate = 0;
        }
        
        if (this.trooper_helmet) {
            this.trooper_helmet.rotation.y += 0.025;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    onResize () {
        this.domRect = this.domContainer.getBoundingClientRect();
        this.renderer.setSize(this.domRect.width, this.domRect.height);
        this.camera.aspect = this.domRect.width / this.domRect.height;
        this.camera.updateProjectionMatrix();
    }
}

module.exports = GameClient;