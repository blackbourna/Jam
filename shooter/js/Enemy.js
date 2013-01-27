BaseEnemy = function(stage, sprite, self, sprite_origin) {
    goog.object.extend(this, new GameObject(stage, sprite, self, sprite_origin.x, sprite_origin.y))
    var dead = false;
    this.damage = 10; // default damage
    var fire_rate = 25; // default fire rate
    var last_fired = Ticker.getTicks();
	this.auto_fire = true;
	this.takes_damage = true;
	
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
            }
        });
        var player = Globals.player;
        var pt = player.getSprite().globalToLocal(sprite.x, sprite.y);
        if (player.getSprite().hitTest(pt.x, pt.y)) {
            player.hit(this.damage);
        }
		if (this.autofire){
			if (Ticker.getTicks() - last_fired >= fire_rate) {
				SoundJS.play('hit');
				var bullet = new Bullet(stage, self.getSprite(), 0, 10, this.damage)
				bullet.tag = "EnemyBullet";
				last_fired = Ticker.getTicks();
			}
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

Boss = function(stage){
    var sprite = goog.object.clone(sprites.boss_empty);
    var self = this;
    goog.object.extend(this, new BaseEnemy(stage, sprite, this, {x: 300-sprite.image.width/2, y: -sprite.image.height}));
    this.tag = "Boss";
    this.ship_speed = {x: 0, y: 1};
    this.points = 100;
    this.damage = 10;
	this.health = 1000;
	this.auto_fire= false;
	this.sprites = {
		empty :			goog.object.clone(sprites.boss_empty),
		bottom_right:	goog.object.clone(sprites.boss_bottom_right),
		middle : 		goog.object.clone(sprites.boss_middle),
		bottom_left:	goog.object.clone(sprites.boss_bottom_left),
		top_left:		goog.object.clone(sprites.boss_top_left),
		top_right:		goog.object.clone(sprites.boss_top_right)
	};
	
	this.intro = true; //intro, battle
	this.active_mode = 'basic';
	
	this.left_eye_origin = {
		x : 0, y : 0
	};
	
	this.right_eye_origin = {
		x : 0, y : 0
	};
	
	this.damage_timeout = 0;
	this.update_eyes = function(){
		if (self.damage_timeout == 0){
		var player = Globals.player;
		if ((player.getSprite().x+player.getSprite().image.width) - (sprite.x + sprite.image.width/2) < -100){
			self.replaceSprite("boss_bottom_left");
		}
		else if ((player.getSprite().x+player.getSprite().image.width) - (sprite.x+sprite.image.width/2) > 100){
			self.replaceSprite("boss_bottom_right");
		}
		else{
			self.replaceSprite("boss_middle");
		}
	}
	};
	this.mode = {//basic,laser, heatguided
		basic: {
				base_shot_interval : 25,//25 frames between shots
				base_shot_variance: 10,//10 frame variance
				shot_interval : 0,
				mode_interval : 600,
				sub_mode_interval: 10,
				bounce_direction : 1,
				anger_timeout_base: 200,//200 frames until you can bump anger again
				anger_timeout:0,
				anger : 3,
				fire_bullet : function(){
					var mode = self.mode.basic;
					var velX = 0;
					var velY = 20;

					//angle = atan2 (y, x);
					//x1 += cos (angle)*speed;
					//y1 += sin (angle)*speed;
					
					var leftEye = Math.random() > 0.5;
					if (leftEye){					
						var bullet = new Bullet(stage, self.left_eye_origin, velX, velY,  self.damage);
						bullet.tag = "EnemyBullet";
						}
					else {
						var bullet = new Bullet(stage, self.right_eye_origin, velX, velY,  self.damage);
						bullet.tag = "EnemyBullet";
					}
				},
				update : function(){
					var mode = self.mode.basic;
					sprite.x += mode.bounce_direction * mode.anger;
					
					if (sprite.x + sprite.image.width > 750){
						mode.bounce_direction = -1;
					}
					else if (sprite.x < -100){
						mode.bounce_direction = 1;
					}
					
					self.update_eyes();
				},
				damaged : function(damage){
					var mode = self.mode.basic;
					if (mode.anger_timeout)
						mode.anger_timeout--;
					if (mode.anger_timeout == 0){
						mode.anger += (damage/3) | 1;
						mode.anger_timeout = mode.anger_timeout_base;
					}
					
					self.health -= (damage/3) | 1;
					self.damage_timeout = 5;
					if (self.health < 1) {
						self.replaceSprite("boss_death");	
						self.resetMode("shake");
					}
					else {
						self.replaceSprite("boss_death");
					}

				},
				next_mode : function(){
					return 'shake';
				}
			},
		shake : {
			mode_interval : 200,
			update : function(){
					var mode = self.mode.basic;
					sprite.x += Math.floor(Math.random()*30)-15;
				},
			next_mode : function(){
				if (self.health < 1) {
					stage.removeChild(sprite);
					goog.array.remove(Globals.gameObjects, self);
				}
				return 'blast';
			}
			},
		blast : {
			base_shot_interval : 1,//50 frames between shots
			base_shot_variance: 0,//30 frame variance
			shot_interval : 1,
			mode_interval : 80,
			update : function(self){
					var mode = self.mode.basic;
					sprite.x += Math.floor(Math.random()*30)-15;
					self.update_eyes();
				},
			fire_bullet : function(){
				self.mode.basic.fire_bullet();
			},
			next_mode : function(){
				return 'rest';
			}
		},
		rest : {
			shot_interval: 0,
			mode_interval:200,
			next_mode : function(){return 'basic';},
			damaged : function(damage){
				self.mode.basic.damaged(damage*3);
			}
			}
		};
	var mode_shot_counter = 0;
	var mode_counter = 0;
	this.replaceSprite = function(new_sprite){
		self.old_sprite = sprite;
		stage.removeChild(sprite);
		sprite = goog.object.clone(sprites[new_sprite]);
		self.active_sprite = new_sprite;
		sprite.x = self.old_sprite.x;
		sprite.y = self.old_sprite.y;
		stage.addChild(sprite);
	};
    this.update = function(e) {
		
		//invincible, shaking onto screen
		if (this.intro){	
			sprite.x += Math.floor(Math.random()*3)-1;
			sprite.y += Math.floor(Math.random()*6)-1;
			if (sprite.y > 100) {
				self.ship_speed.y = 0;
				self.intro = false;
				this.replaceSprite("boss_middle");
			}
		} else {
			if (self.damage_timeout){
				self.damage_timeout--;
				if (self.damage_timeout ==0){
					self.replaceSprite("boss_middle");
				}
			}
			var activemode = this.mode[this.active_mode];
			
			if (activemode.update){
				activemode.update(this);
				}
			mode_shot_counter++;
			mode_counter++;
			console.log(mode_counter);
			console.log(activemode.mode_interval);
			if (mode_shot_counter > activemode.shot_interval){
				//spawn basic shot
				if (activemode.fire_bullet){
					activemode.fire_bullet(this);
					activemode.shot_interval = activemode.base_shot_interval + Math.floor(Math.random()*activemode.base_shot_variance);
					}
				mode_shot_counter = 0;
			}
			if (mode_counter > activemode.mode_interval){
				this.resetMode(activemode.next_mode());
			}
		}

        //if (this.sprite.y > stage.canvas.height) {
          //  stage.removeChild(this.sprite);
        //    goog.array.remove(Globals.gameObjects, self);
        //}
		this.left_eye_origin.x = sprite.x + 62;
		this.left_eye_origin.y = sprite.y + 260;
		this.right_eye_origin.x = sprite.x + 130;
		this.right_eye_origin.y = sprite.y + 240;
		
        this.baseUpdate();
    };
	
	this.resetMode = function(mode){
		mode_counter = 0;
		self.active_mode = mode;
		console.log(mode);
	};
	
	this.hit = function(damage) {
		var activemode = this.mode[this.active_mode];
		if (activemode.damaged)
			activemode.damaged(damage);
	};
}
