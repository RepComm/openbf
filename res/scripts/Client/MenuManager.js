
let CONTROL_TYPES = {
    boolean:"boolean", //On or off / False or True / Enabled or Disabled
    radio:"radio", //Multi-option single-select
    text:"text", //A text input field
    number:"number", //Can be a decimal
    integer:"integer", //No decimals dangit!
    color:"color", //Opens a color picker
};

/* MenuManager is an object with functions to manage ingame overlay menus (not hud)
 * Example usage:
 * const MenuManager = require("./MenuManager");
 * const Menu = MenuManager.Menu; //Optional, you could just ref MenuManager.Menu every time..
 * 
 * let myCustomMenu = new Menu("menuNameHere"); //or 'new MenuManager.Menu("menuNameHere");'
 * MenuManager.addMenu(myCustomMenu); //Registers/adds our menu as a tab
 * 
 * See Menu class comment section for usage of controls
 */

let MenuManager = {
    isInitialized:false,
    element:undefined,
    menus:undefined, //No need to reference object/array if its empty..
    init:(menu_container_element)=>{
        if (!menu_container_element) throw "MenuManager.init(" + menu_container_element + ") isn't valid! I need a string id or a domElement instead!";
        if (this.isInitialized) throw "MenuManager has already been initialized! Please don't call init from a mod, its only suppose to be done internally ;)";
        if (typeof(menu_container_element) === "string") {
            let e = document.getElementById(menu_container_element);
            if (!e) {
                throw "No element with id of " + e + "! MenuManager cannot be initialized!";
            }
        }
        this.element = menu_container_element;
        this.isInitialized = true;
    },
    getMenu(id) {
        return menus[id];
    },
    addMenu(menu) {
        if (menu && menu.name) {
            this.menus[menu.name] = menu;
            this.element.appendChild(menu.element);
        }
    }
};

/* Menu class is for you to create custom menus (that appear as a tab)
 * Example usage:
 * let myCustomMenu = new Menu("menuNameHere"); //or new MenuManager.Menu("menuNameHere");
 * myCustomMenu.addControl({
 *     name:"myCharacterOptions", //Accessible using this name
 *     displayName:"Hat Color", //Optional, no label appears if undefined/false
 *     type:"color", //See Menu.types[] for stock types
 *     defaultValue:"rgb(54, 245, 200)", //Default value of the control (if applicable)
 *     onValueChange:function (control, oldValue, newValue) {
 *         alert("Well, that happened..");
 *         console.log("My new value is", newValue);
 *     }
 * });
 * 
 * If you need radio options (only one possible selection), use "radio". See docs please!
 */

class Menu {
    constructor (properties) {
        Object.assign(this, properties);
        this.element = document.createElement("div");
        this.className = "menutab";
        this.element.id = "menutab_" + this.name;
        this.controls = undefined;
    }
    addControl(control) {
        if (!this.controls) this.controls = {};
        this.controls[control.name] = control;
        this.element.appendChild(control.element);
    }
    getControl (id) {
        if (!this.controls) return false;
        return this.controls[id];
    }
}

/* Controls are normally used for option menus and anything with basic controls
 * Constructor takes a passed object with some keys, and assigns them to itself
 * Some necessary keys are as follows:
 * let myHatColor = new Control({
 *     type:color,
 *     defaultValue:"white",
 *     name:"myHatColor",
 *     displayName:"Hat Color"
 * });
 * 
 */

class Control {
    constructor (properties) {
        Object.assign(this, properties);
        if (!this.name || typeof(this.name) === "string") throw "Control must have a name!";
        if (this.defaultValue === undefined || this.defaultValue === null) this.value = false;

        switch (this.type) {
            case CONTROL_TYPES.boolean:
                this.element = document.createElement("input");
                this.element.type = "checkbox";
                this.element.id = "menucontrol_" + this.name;
                this.element.className = "menucontrol";
                this.element.value = this.defaultValue;
                break;
            case CONTROL_TYPES.radio:
                //Add a bunch of controls
                this.element = document.createElement("radio");
                this.element.type = "checkbox";
                this.element.id = "menucontrol_" + this.name;
                this.element.className = "menucontrol";
                this.element.value = this.defaultValue;
                break;
            case CONTROL_TYPES.text:
                break;
            case CONTROL_TYPES.number:
                break;
                case CONTROL_TYPES.integer:
                break;
            case CONTROL_TYPES.color:
                break;
            default:
                break;
        }
        
    }
    getValue () {
        return this.element.value;
    }
}

MenuManager.Menu = Menu; //Add this class type to MenuManager for ease access
MenuManager.Control = Control; //^^

module.exports = MenuManager;
