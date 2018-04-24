# OpenBF

OpenBF is an **implementation** of battlefront (2004).
You can consider the product a 'fan game,' and the development of it an educational endeavor.
I don't really enjoy playing games, but creating things is super fun.
## Goals of this project
- Education for contributors (mainly myself in mind) to keep learning new technologies and computer theory.
- Excessive use of new technology such as Node.js, Electron, Three.js, VSCode, Git, to name a few.
- Implement a **compatible** client that works with main-stream stock 1.2 version of Star Wars Battlefront (2004), and potentially SWBFII (2005).
- Redesign on how modding the game works, including (not limited to):
  - Using custom shaders/materials w/ three.js and webgl
  - Multi-language support (the first one was awful..)
  - Non-compiled modifications (cross platform!)
  - Cross platform design
  - Live testing/debugging
  - Mid-game changes
  - Multiplayer custom networking for mods
  - Streamable mods (no need to install, just join a server!)
  - No more long build processes! Forget about 'munge' compilers.
- Modding core used to design how the 'stock' game is built. You get the tools to create the same way we do.
- Make example use of open-source/free tools available to the average person today.
- Only self-made assets (based on the originals) to keep copyright in a galaxy *far far* away.
- Similar feeling controls, but ability for modders to completely rewrite it in their own content (also, we'll get rid of some limitations in physics that the original game has).
### Future goals
I intend to use this as a platform|framework to help younger people how to have fun while learning. Modding will be designed with education and fun in mind. Most of my projects have this kind of goal in my mind.
## Main Tools|Tech used
- [Blender](http://blender.org)
- [Three.js](http://threejs.org)
- [Electron.js](http://electronjs.org)
- [VSCode](http://code.visualstudio.com)
- [Node.js](http://nodejs.org)
- JavaScript ( https://en.wikipedia.org/wiki/JavaScript )
## Contributors
I'm moving this project to electron, and updating my code style. I started this about when I found out about Node.js and ES5/6, so I've grown quite a lot in that amount of time.
After I finish up, I'll have some instructions on how to collaborate as a newbie.
There is a lot of work to do, and you don't need to be a genius to do it!
### Progess
- MSH parser written completely in a JS file, useful for loading stock assets into the game until their replaced with blender replacements.
- Terrain parser, useful for implementing terrain that is compatible with original game.
- [jweigelt on github](https://github.com/jweigelt) has done amazing things with networking up to this point, and the server list is now retrievable. His projects are really cool, check him out!
- *{Insert all boring stuff that is a big deal, but doesn't sound cool in writting, here}*
### Disclaimers
The product will not be sold, and anyone attempting to do so will be out of bounds with fair use. I cannot/will not be liable for any fork that breaches copyright.