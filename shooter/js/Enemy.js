BaseEnemy = function(stage, sprite, self, sprite_origin) {
    goog.object.extend(this, new GameObject(stage, sprite, self, sprite_origin.x, sprite_origin.y))
    var dead = false;
    this.damage = 10; // default damage
    var fire_rate = 25; // default fire rate
    var last_fired = Ticker.getTicks();
    this.baseUpdate = function() {
        sprite.x += this.ship_speed.x;
        sprite.y += this.ship_speed.y;
        if (sprite.y > stage.canvas.height) {
            self.hit(10000);
        }
        // player bullet hit detection
        var bullets = Globals.player.getBullets();
        goog.array.map(bullets, function(obj) {
            var bulletSprite = obj.getSprite();
            var pt = sprite.globalToLocal(bulletSprite.x, bulletSprite.y);
            //console.log(bulletSprite.x, bulletSprite.y, obj.getSprite());
            if (sprite.hitTest(pt.x, pt.y) && !dead) {
                self.hit(1);
                Globals.player.addPoints(self.points);
				SoundJS.play('hurtPlayerMP3');
            }
        });
        var player = Globals.player;
        var pt = player.getSprite().globalToLocal(sprite.x, sprite.y);
        if (player.getSprite().hitTest(pt.x, pt.y)) {
            player.hit(this.damage);
        }
        if (Ticker.getTicks() - last_fired >= fire_rate) {
			//var audio = new Audio(sndDir+"sfx/scan1.wav").play();
            var bullet = new Bullet(stage, self.getSprite(), 0, 10, this.damage, "standardGunMP3")
            bullet.tag = "EnemyBullet";
            last_fired = Ticker.getTicks();
        }
    }
}

SpaceInvaderEnemy = function(stage, sprite_origin) {
  var sprite = goog.object.clone(sprites.enemy);
  goog.object.extend(this, new BaseEnemy(stage, sprite, this, {x: sprite_origin, y: -sprite.image.height}))
    this.health = 1;
  this.ship_speed = {x: 10, y: 0};
  var self = this;
  this.tag = "SpaceInvaderEnemy";
  this.points = 500;
  this.update = function(e) {
    // check the borders, if hit, reverse the direction and move down
    if (sprite.x >= (1024 - sprite.image.width) || sprite.x <= 0) {
      this.ship_speed.x *= -1;
      this.ship_speed.y = 100;
    } else {
      this.ship_speed.y = 0;
    }
    this.baseUpdate();
  }
}
Enemy = function(stage, xPos) {
    var sprite = goog.object.clone(sprites.enemy);
    var self = this;
    goog.object.extend(this, new BaseEnemy(stage, sprite, this, {x: xPos, y: -sprite.image.height}));
    this.tag = "Enemy";
    this.ship_speed = {x: 0, y: 0};
    this.points = 100;
    this.damage = 25;
    this.update = function(e) {
        this.ship_speed.x = 10*Math.sin(sprite.y/60);
        this.ship_speed.y = 5;
        if (sprite.y > stage.canvas.height) {
            stage.removeChild(sprite);
            goog.array.remove(Globals.gameObjects, self);
        }
        this.baseUpdate();
    }
}
