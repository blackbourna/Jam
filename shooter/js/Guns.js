bullet_types = ["standardGun", "machineGun", "doubleGun", "spreadGun", "fireballGun"];
BulletInfo = [
	//0
	{
		name: "standardGun",
		x:[0],
		y:[-10],
		damage: 5,
		rate: 10,
		startPositionX: [0]

	},
	//1
	{
		name: "machineGun",
		x:[0],
		y:[-10],
		damage: 5,
		rate: 10,
		startPositionX: [0]

	},
	//2
	{
		name: "doubleGun",
		x:[-5, 5],

		y:[-10,-10],
		damage: 5,
		rate: 10,
		startPositionX: [-10, 10]

	},
	//3
	{
		name: "spreadGun",
		x:[-10, -5, 0, 5, 10],
		y:[-10,-10,-10,-10,-10],
		damage: 5,
		rate: 7,
		startPositionX: [0, 0, 0, 0, 0]

	},
	//4
	{
		name: "fireballGun",
		x: [0, 0, 0,0,0,0,0],
		y: [-10, -10, -10,-10,-10,-10,-10],
		damage: 5,
		rate: 10,
		startPositionX: [-15, -10, -5, 0, 5, 10, 15]

	}
]

PowerUp = function(stage, sprite_origin, powerup_vector) {
    var randomSpriteIndex = Math.floor(Math.random() * BulletInfo.length);
	if (randomSpriteIndex == 0) {
		return;
	}
	var gunSprites = [
		null, // stdGun has no sprite
		sprites.machineGun,
		sprites.doubleGun,
		sprites.spreadGun,
		sprites.fireballGun,
	]
	console.log("PowerUp: ",randomSpriteIndex);
    var randomSpriteName = bullet_types[randomSpriteIndex];
	var sprite = goog.object.clone(gunSprites[randomSpriteIndex]);
	Globals.player.bulletText = randomSpriteName;
    var x = Math.random() * 924 + 100;
    var y = -10;
    goog.object.extend(this, new GameObject(stage, sprite, this, x, y));
    var self = this;
    this.tag = "PowerUp - " + randomSpriteName;
	var scale = 0.01;
    this.update = function(e) {
		if (!enabled) return;
        sprite.y += powerup_vector;
        sprite.x = sprite.x + (3 * Math.cos(sprite.y/180));
        if (sprite.y > stage.canvas.height) {
			self.hit(1);
			return;
        }
		var playerSprite = Globals.player.getSprite();
		var pt = sprite.globalToLocal(playerSprite.x, playerSprite.y);
		if (sprite.hitTest(pt.x, pt.y)) {
			self.hit(1);
			Globals.player.powerUp(randomSpriteIndex, randomSpriteName);
			enabled = false;

		}
    }
	var enabled = true;
}

Bullet = function(stage, sprite_origin, bullet_x, bullet_y, opt_damage) {
    var sprite = goog.object.clone(sprites.bullet);
	sprite.scaleY = 0.25;

    var x = sprite_origin.x + sprite.image.width;    


    var y = sprite_origin.y - sprite.image.height;
    
    var self = this;
    var booster = 1;
    SoundJS.play('hit');
    this.tag = "Bullet";
    goog.object.extend(this, new GameObject(stage, sprite, this, x, y));

    this.update = function(e) {
        booster = booster * 1.01;
        //sprite.x += bullet_x;
        //sprite.y += bullet_y;
        sprite.x += bullet_x;
        
        sprite.y += bullet_y * booster;
		
        if (sprite.y < 0 || sprite.y > stage.canvas.height) {
			self.hit(1);
        }
		if (this.tag == "EnemyBullet") {
			var player = Globals.player;
			var pt = player.getSprite().globalToLocal(sprite.x, sprite.y);
			if (player.getSprite().hitTest(pt.x, pt.y)) {
				player.hit(opt_damage);
				self.hit(1);
			}
		}
    }
}
