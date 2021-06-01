import Phaser from "./phaser.js"
import Start from "./scenes/Start.js"
import Game from "./scenes/Game.js"
import GameOver from "./scenes/GameOver.js"
export default new Phaser.Game({
  type: Phaser.AUTO,
  width: 480,
  height: 640,
  scene: [Start, Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
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