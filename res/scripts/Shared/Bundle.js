/* This is the base class for any/every mod to the game.
 * I'm going with bundle because I want to detatch from common
 * thinking about how the game works in comparison to the original.
 * 
 * This game is entirely built out of mods, besides the base framework.
 * Anything this game is shipped with is also reproducable within your own mod.
 * You get all the necessary tools to build the game as developers do.
*/

class Bundle {
    constructor (game, name, displayName) {
        if (!name || name == "") throw "Bundle constructor first argument requires a string for the name!";
        this.game = game;
        this.name = name;
        this.sessionUniqueId = 0;
        this.displayName = (displayName || name);
    }

    onReady () {
        
    }

    onUpdate () {

    }

}

module.exports = Bundle;