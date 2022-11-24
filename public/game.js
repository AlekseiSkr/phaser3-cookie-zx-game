class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
  }

  delete() {
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0, 0);
    this.disableBody(true);
  }

  fire(x, y, val) {
    this.enableBody(true, true);
    this.setActive(true);
    this.body.reset(x, y);
    this.setVisible(true);
    let bv;
    switch (val) {
      case 270:
        bv = { x: 0, y: -700 };
        break;
      case 180:
        bv = { x: -700, y: 0 };
        break;
      case 90:
        bv = { x: 0, y: 700 };
        break;
      case 0:
        bv = { x: 700, y: 0 };
        break;
    }
    this.setVelocity(bv.x, bv.y);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (
      this.y <= -5 ||
      this.y >= config.height ||
      this.x <= -5 ||
      this.x >= config.width
    ) {
      this.delete();
    }
  }
}

class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 2,
      key: "bullet",
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  fireBullet(x, y, val) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.setScale(0.7);
      bullet.fire(x, y, val);
    }
  }
}

class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "ball");
    this.isHit = false;
  }

  delete() {
    this.setActive(false);
    this.setVisible(false);
  }

  spawn(x, y) {
    this.enableBody(true, true);
    this.setAlpha(1);
    this.setActive(true);
    this.body.reset(x, y);
    this.setVisible(true);
    this.setCircle(30);
    this.setCollideWorldBounds(true);
    this.setBounce(1);
    this.setPosition(x, y);
    this.setFriction(10, 10);
    this.setVelocity(190, -180); // AHUYENY Diagonal movenement VECTOR
    this.closeBounds();
  }

  sendOutBalls() {
    this.body.setBoundsRectangle(
      new Phaser.Geom.Triangle(500, 0, 760, 45, 600, 600)
    );
    this.setDepth(-1);
    this.setVelocity(-220, 200);
  }

  closeBounds() {
    this.body.setBoundsRectangle(
      new Phaser.Geom.Rectangle(0, 0, config.width - 150, config.height - 151)
    );
  }

  spawnInBox(bounds, x, y) {
    this.body.setBoundsRectangle(bounds);
    this.enableBody(true, true);
    this.setAlpha(1);
    this.setActive(true);
    this.body.reset(x, y);
    this.setVisible(true);
    this.setCircle(30);
    this.setCollideWorldBounds(true);
    this.setBounce(1);
    this.setPosition(x, y);
    this.setVelocity(90, -100);
    this.setDepth(1);
    // this.closeBounds()
  }

  hit() {
    this.setVelocity(0, 700);
    this.isHit = true;
    this.body.setBoundsRectangle(
      new Phaser.Geom.Rectangle(0, 0, config.width - 150, config.height)
    );
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (
      this.y <= -5 ||
      this.y >= config.height ||
      this.x <= -5 ||
      this.x >= config.width ||
      this.isCollided
    ) {
      this.delete();
    }
  }
}

class Balls extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 20,
      key: "ball",
      active: false,
      visible: false,
      classType: Ball,
    });
  }

  spawnBox(bounds, x, y) {
    let ball = this.getFirstDead(false);
    if (ball) {
      ball.spawnInBox(bounds, x, y);
    }
  }

  spawnBall(x, y) {
    let ball = this.getFirstDead(false);
    if (ball) {
      ball.spawn(x, y);
    }
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super();
    this.balls;
    this.bullets;
    this.player;
    this.hitBox;
    this.stage;
    this.scoreText;
    this.score
  }

  preload() {
    this.load.image("bullet", "./img/hit1.png");
    this.load.image("player", "./img/hero.png");
    this.load.image("ball", "./img/ball.png");
  }

  create() {
    // //Test-Bullet Setup
    var missW = 200;
    var missH = 150;
    var score = 0;
    this.score;
    this.stage = 1;
    this.scoreText = this.add.text(350, 500, "Score:>"+ score);
    this.scoreText.setColor(0xffffff);
    this.scoreText.setDepth(10)

    // this.enemy.hit = new Ball(this);
    this.bullets = new Bullets(this);
    this.balls = new Balls(this);
    this.player = this.physics.add.image(300, 200, "player");

    //Goal Box Setup
    this.hitBox = this.add.rectangle(
      config.width / 2 - 75,
      config.height - missH / 2,
      300,
      150,
      0x9966ff
    );
    this.missBoxL = this.add.rectangle(
      0 + missW / 2 - 25,
      config.height - missH / 2,
      missW,
      missH,
      0x6699ff
    );
    this.missBoxR = this.add.rectangle(
      config.width - missW / 2 - 150,
      config.height - missH / 2,
      missW,
      missH,
      0xa3b899
    );
    this.sideHUD = this.add.rectangle(725, 300, 150, 600, 0xae99ff);
    var spawnBox1 = this.add.rectangle(725, 75, 80, 80, 0x111211);
    var spawnBox4 = this.add.rectangle(725, 190, 80, 80, 0x8060ff);
    var spawnBox2 = this.add.rectangle(725, 305, 80, 80, 0x8060ff);

    this.bullets.children;
    this.balls.children;

    this.balls.x = 300;
    this.balls.y = 300;
    Phaser.Actions.SetXY(this.balls.getChildren(), -100, -200, 32);
    Phaser.Actions.SetXY(this.bullets.getChildren(), -100, -200, 32);

    //HitBox Setup
    this.physics.add.existing(this.missBoxL);
    this.physics.add.existing(this.hitBox);
    this.physics.add.existing(this.missBoxR);
    // this.physics.add.existing(missBoxL);
    // this.physics.add.existing(missBoxR);
    this.hitBox.setActive(true);
    this.missBoxL.setActive(true);
    this.missBoxR.setActive(true);
    this.hitBox.body.setAllowGravity(false);
    this.missBoxL.body.setAllowGravity(false);
    this.missBoxR.body.setAllowGravity(false);
    // this.hitBox.setGravity(0, (config.physics.arcade.gravity.y) * -1);
    // missBoxL.setGravity(0, (config.physics.arcade.gravity.y) * -1);
    // this.hitBox.setGravity(0, (config.physics.arcade.gravity.y) * -1);

    //Ball Setup
    // this.balls.spawnBall(280, 180);
    // this.balls.spawnBall(260, 160);
    // this.balls.spawnBall(240, 140);
    // this.balls.spawnBall(300, 200, 4);

    //Player Setup - Move to Player Class
    this.player.setActive(true);
    this.player.enableBody(true);
    this.player.setPushable(false);
    this.player.setCollideWorldBounds(true);
    this.player.setGravity(0, config.physics.arcade.gravity.y * -1);
    this.player.body.setBoundsRectangle(
      new Phaser.Geom.Rectangle(0, 0, config.width - 150, config.height - 150)
    );

    //Input Setup
    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    //ADD to Player Class
    this.playerRotation = {
      rotation: 0,
      lastPositionX: 0,
      lastPositionY: 0,
    };

    //Animation on hit
    var tween = this.tweens.add({
      targets: [this.balls.getChildren()],
      duration: 100,
      alpha: 0.2,
      loop: 3,
      yoyo: true,
      paused: true,
    });

    //Add on Collision Event to game class
    this.physics.add.collider(
      this.balls,
      this.bullets,
      function (ball, bullet) {
        bullet.delete();
        ball.hit();
        ball.body.checkCollision = true;
        tween.restart();
        tween.data[0].target = ball;
        tween.play();
      }
    );

    this.physics.add.collider(
      this.balls,
      this.player,
      function (ball, player) {
        
        player

        ball.body.checkCollision = true;
        tween.restart();
        tween.data[0].target = player;
        tween.play();
      }
    );

    //Add on Overlap Event to game class
    this.physics.add.overlap(this.balls, this.hitBox, function (hitBox, ball) {
      ball.disableBody(true, true);
      ball.setActive(false);
      if (ball.isHit) {
        score++;
        this.score = score
        console.log('this>' + this.score);
        console.log(score);
        tween.pause();
        tween.restart();
      }
    });

    //Add on Overlap Event to game class
    this.physics.add.overlap(
      this.balls,
      this.missBoxL,
      function (missBoxL, ball) {
        ball.disableBody(true, true);
        ball.setActive(false);

        if (ball.isHit) {
          tween.pause();
          tween.restart();
        }
      }
    );

    //Add on Overlap Event to game class
    this.physics.add.overlap(
      this.balls,
      this.missBoxR,
      function (missBoxR, ball) {
        ball.disableBody(true, true);
        ball.setActive(false);

        if (ball.isHit) {
          console.log(score);
          tween.restart();
        }
      }
    );

    //Scenario game Start
    // timedEvent = this.time.delayedCall(3000, onEvent, [], this);

    if ((this.stage == 1)) {
      var borderBox1 = new Phaser.Geom.Rectangle(680, 30, 80, 80);
      this.balls.spawnBox(borderBox1, 750, 32);
      this.balls.spawnBox(borderBox1, 730, 44);
      this.balls.spawnBox(borderBox1, 720, 60);
      this.balls.spawnBox(borderBox1, 690, 75);

      this.time.delayedCall(
        3000,
        function () {
          this.balls.getChildren().forEach((ball) => {
            ball.sendOutBalls();
            ball.setVelocity(
              Math.floor(Math.random() * (200 - 30 + 1)) + 30,
              Math.floor(Math.random() * (200 - 60 + 1)) + 60
            );
          });
          this.time.delayedCall(
            900,
            function () {
              this.balls.getChildren().forEach((ball) => {
                ball.closeBounds();
              });
            },
            [],
            this
          );
        },
        [],
        this
      );
    }
    if (this.stage == 2 && this.stage > 1) {
      var borderBox2 = new Phaser.Geom.Rectangle(680, 145, 80, 80);
      this.balls.spawnBox(borderBox2, 750, 110);
      this.balls.spawnBox(borderBox2, 730, 160);
      this.balls.spawnBox(borderBox2, 720, 180);
      this.balls.spawnBox(borderBox2, 690, 140);

      this.time.delayedCall(
        3000,
        function () {
          this.balls.getChildren().forEach((ball) => {
            ball.sendOutBalls();
            ball.setVelocity(
              Math.floor(Math.random() * (200 - 30 + 1)) + 30,
              Math.floor(Math.random() * (200 - 60 + 1)) + 60
            );
          });
          this.time.delayedCall(
            900,
            function () {
              this.balls.getChildren().forEach((ball) => {
                ball.closeBounds();
              });
            },
            [],
            this
          );
        },
        [],
        this
      );
    }
  }

  update() {
    (this.balls.countActive(true) < 1 && this.stage !=2) ? this.stage++ : 0x0;
    // console.log(this.stage);

    //Player onUpdate() SETUP
    //Player Movement and input
    const travelDistance = 6;
    //Constant rotation Down
    this.playerRotation.rotation = this.player.angle = 90;
    //Y-axis
    if (this.inputKeys.up.isDown) {
      this.player.y -= travelDistance;
      this.playerRotation.rotation = this.player.angle = 270;
    } else if (this.inputKeys.down.isDown) {
      this.player.y += travelDistance;
      this.playerRotation.rotation = this.player.angle = 90;
    }
    //X-axis
    if (this.inputKeys.left.isDown) {
      this.player.x -= travelDistance;
      this.playerRotation.rotation = this.player.angle = 180;
    } else if (this.inputKeys.right.isDown) {
      this.player.x += travelDistance;
      this.playerRotation.rotation = this.player.angle = 0;
    }
    //One shot only per spacebar press
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.shoot)) {
      this.bullets.fireBullet(
        this.player.x,
        this.player.y,
        this.playerRotation.rotation
      );
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "phaser-example",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 200 },
    },
  },
  scene: GameScene,
};

let game = new Phaser.Game(config);

fetch("./Scores.json")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
