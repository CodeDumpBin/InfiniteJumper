import Phaser from "../phaser.js"

export default class Start extends Phaser.Scene {
  platform
  player
  grounds = ['ground_snow', 'ground_grass', 'ground_sand', 'ground_wood', 'ground_cake'];
  constructor() {
    super("start")
  }
  preload() {
    this.load.image('background', 'assets/PNG/Background/bg_layer1.png')

    for (let g = 0; g < this.grounds.length; g++) {
      this.load.image(this.grounds[g], 'assets/PNG/Environment/' + this.grounds[g] + ".png")
    }
    this.load.image('bunny-jump', 'assets/PNG/Players/bunny1_jump.png')
    this.load.audio('jump', 'assets/phaseJump1.ogg')
    this.load.audio('coin-collected', 'assets/coin.wav')
    this.load.image('bunny-stand', 'assets/PNG/Players/bunny1_stand.png')
    this.load.image('carrot', 'assets/PNG/Items/carrot.png')
    this.load.image('enemy', 'assets/PNG/Enemies/spikeMan_stand.png')
    this.load.image('enemy-stuck', 'assets/PNG/Enemies/spikeMan_walk1.png')
    this.load.image('bunny-hurt', 'assets/PNG/Players/bunny1_hurt.png')
    this.load.audio('hit', 'assets/hit.wav')
    this.load.plugin("Phaser3Swipe", Phaser3Swipe, true);



  }
  create() {
    this.add.image(0, 0, 'background')
    this.platform = this.physics.add.staticImage(this.scale.width / 2, (this.scale.height / 2) + 100, 'ground_grass')
    this.add.text((this.scale.width / 2) - 100, (this.scale.height / 2) + 100, 'Infinite Jumper', { fontSize: 20, color: "#FFFF00" })
    this.player = this.physics.add.image(this.scale.width / 2, (this.scale.height / 2) - 140, 'bunny-stand')
    this.physics.add.collider(this.platform, this.player)

  }

  update() {

    if (this.player.body.touching.down) {
      this.player.setVelocityY(-200)
      this.player.setTexture('bunny-jump')
    }

    const vy = this.player.body.velocity.y
    if (vy > 0 && this.player.texture.key !== 'bunny-stand') {
      this.player.setTexture('bunny-stand')
    }

    this.input.on('pointerup', function () {
      this.scene.start('game')
    }, this);

  }
}