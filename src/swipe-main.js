import Phaser from "./phaser.js"
import Start from "./scenes/SwipeStart.js"
// import Phaser3Swipe from "./swipe.js"
// console.log('LLLLLLLLLLLLLLLLLLLL',Phaser3Swipe)
export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  scene: [Start, Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true
    }
  },
  input: {
    touch: {
      capture: true
    }
  },
  plugins: {
    global: [
      {
        key: 'Phaser3Swipe',
        plugin: Phaser3Swipe,
        start: true,
      }
    ]
  }

})