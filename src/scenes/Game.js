import Phaser from "../phaser.js"
import Carrot from "../game/Carrot.js"
import Enemy from "../game/Enemy.js"

export default class Game extends Phaser.Scene {
  player
  platforms
  cursor
  carrots
  enemies
  carrotsCollected = 0
  bunnySpeed = -400;
  carrotsCollectedText;
  latestPlatform;
  swipe

  grounds = ['ground_snow', 'ground_grass', 'ground_sand', 'ground_wood', 'ground_cake'];
  constructor() {
    super("game")
  }
  init() {
    this.carrotsCollected = 0
  }
  preload() {


    this.cursor = this.input.keyboard.createCursorKeys()

  }
  create() {
    this.add.image(240, 320, 'background').setScrollFactor(1, 0)
    this.platforms = this.physics.add.staticGroup()
    const max = 8;
    const min = 2;
    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(80, 400)
      const y = 150 * i;
      const platform = this.platforms.create(x, y, this.grounds[Math.floor(Math.random() * this.grounds.length)])
      platform.scale =
        Math.floor(Math.random() * (max - min + 1) + min) / 10;
      const body = platform.body;
      body.updateFromGameObject();
    }

    this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)
    this.physics.add.collider(this.platforms, this.player)
    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setDeadzone(this.scale.width * 1.5)
    this.carrots = this.physics.add.group({ classType: Carrot })
    this.enemies = this.physics.add.group({ classType: Enemy })
    this.carrots.get(20, 500, 'carrot')
    this.enemies.get(200, 500, 'enemy')
    this.physics.add.collider(this.carrots, this.platforms)
    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.collider(this.player, this.carrots, this.handleCollectCarrot, undefined, this)
    this.physics.add.collider(this.player, this.enemies, this.handleEnemy, undefined, this)
    this.carrotsCollectedText = this.add.text(240, 10, 'Carrots : 0', { color: '#000', fontSize: 24 }).setScrollFactor(0).setOrigin(0.5, 0)

    this.swipe = this.plugins.get('Phaser3Swipe');
    // this.swipe.load(this);

    this.events.on("swipe", (e) => {
      if (e.right) {
        console.log("Hacer algo a la derecha");
        this.player.setVelocityX(200)
      }
      else if (e.left) {
        console.log("Hacer algo a la izquierda");
        this.player.setVelocityX(-200)

      }
      // else if (e.up) {
      //   console.log("Hacer algo a la arriba");
      // }
      // else if (e.down) {
      //   console.log("Hacer algo a la abajo");
      // }
    })


  }
  update(t, dt) {

    this.platforms.children.iterate(child => {
      const platform = child
      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100)
        platform.body.updateFromGameObject()
        this.latestPlatform = platform;
        this.addCarrotAbove(platform)
      }
    })
    if (dt > 17 && this.latestPlatform) {
      this.addEnemiesAbove(this.latestPlatform)
    }

    const touchingDown = this.player.body.touching.down

    if (touchingDown) {

      this.player.setVelocityY(this.bunnySpeed)
      this.sound.play('jump');
      this.player.setTexture('bunny-jump')
    }
    if (this.cursor.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200)
    }
    else if (this.cursor.right.isDown && !touchingDown) {
      this.player.setVelocityX(200)
    } else {
      this.player.setVelocityX(0)
    }
    this.horizontalWrap(this.player)

    const bottomPlatform = this.findBottomMostPlatform()
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start('game-over')
    }
    const vy = this.player.body.velocity.y
    if (vy > 0 && this.player.texture.key !== 'bunny-stand') {
      this.player.setTexture('bunny-stand')
    }

  }

  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth
    }
  }

  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight
    const carrot = this.carrots.get(sprite.x, y, 'carrot')
    carrot.setActive(true)
    carrot.setVisible(true)
    this.add.existing(carrot)
    carrot.body.setSize(carrot.width, carrot.height)
    this.physics.world.enable(carrot)
    return carrot
  }

  addEnemiesAbove(sprite) {
    const y = sprite.y - sprite.displayHeight
    const enemy = this.enemies.get(sprite.x, y, 'enemy')
    enemy.setActive(true)
    enemy.setVisible(true)
    this.add.existing(enemy)
    enemy.body.setSize(enemy.width, enemy.height)
    this.physics.world.enable(enemy)
    return enemy
  }

  handleCollectCarrot(player, carrot) {
    this.carrots.killAndHide(carrot)
    this.physics.world.disableBody(carrot.body)
    this.carrotsCollected++;
    this.sound.play('coin-collected')
    this.carrotsCollectedText.text = 'Carrots : ' + this.carrotsCollected
    if (this.carrotsCollected % 20 === 0 && this.bunnySpeed > -2000) {
      console.log('...bunny speed...', this.bunnySpeed)
      this.bunnySpeed = this.bunnySpeed - 200
    }

  }
  handleEnemy(player, enemy) {
    let parent = this;
    this.scene.pause()
    this.player.setTexture('bunny-hurt')
    enemy.setTexture('enemy-stuck')
    this.sound.play('hit')
    setTimeout(() => {
      parent.scene.start('game-over')
    }, 2500);

  }


  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];
    for (let i = 1; i < platforms.length; ++i) {
      const platform = platforms[i]
      if (platform.y < bottomPlatform.y) {
        continue
      }
      bottomPlatform = platform
    }
    return bottomPlatform
  }
}