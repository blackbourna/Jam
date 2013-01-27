var sprites = [];
var ids = 0;
Main = function() {
    /*
     * Modified version of http://active.tutsplus.com/tutorials/games/learn-createjs-by-building-an-html5-pong-game/
     */
    this.init = function() {
        /* Link Canvas */
        this.canvas = document.getElementById('canvas');
        var stage = new Stage(canvas);
        /* Set The Flash Plugin for browsers that don't support SoundJS */
        SoundJS.FlashPlugin.BASE_PATH = "assets/soundjs_flashplugin";
        if (!SoundJS.checkPlugin(true)) {
          alert("Error!");
          return;
        }
        var imgDir = "assets/image/";
        var sndDir = "assets/audio/";
        var manifest = [
            {src: imgDir+"spaceship.png", id:"player"},
			{src: imgDir+"enemyship.png", id:"enemy"},
            {src: imgDir+"paddle.png", id:"bullet"},
            {src: sndDir+"hit.mp3|"+sndDir+"hit.ogg", id:"hit"}
        ];
        
        var preloader = new PreloadJS();
        preloader.installPlugin(SoundJS);
        var preloadHandler = new PreloaderHandler(manifest, stage);
        preloader.onProgress = preloadHandler.handleProgress;
        preloader.onComplete = preloadHandler.handleComplete;
        preloader.onFileLoad = preloadHandler.handleFileLoad;
        preloader.loadManifest(manifest, stage);
    }
};

PreloaderHandler = function(manifest, stage) {
    var totalLoaded = 0;
    var self = this;
    var progress = 0;
    var progressText = new Text('0%', "12px Arial", Constants.TEXT_COLOR);
    progressText.x = 299;
    progressText.y = 50;
    stage.addChild(progressText);
    var updateProgress = function(event) {
        //use event.loaded to get the percentage of the loading
        if (event.loaded) {
            progressText.text = event.loaded/1*100+"%";
        }
        stage.update();
    }
    this.handleProgress = function(event) {
        updateProgress(event);
    }

    this.handleComplete = function (event) {
        //triggered when all loading is complete
        stage.removeChild(progressText);
        //new MainMenu(stage).show();
        new Game(stage);
    }

    this.handleFileLoad = function(event) {
        //triggered when an individual file completes loading

        switch(event.type) {
            case PreloadJS.IMAGE:
                //image loaded
                var img = new Image();
                img.src = event.src;
                img.onload = self.handleLoadComplete;
                sprites[event.id] = new Bitmap(img);
            break;
            case PreloadJS.SOUND:
                //sound loaded
                self.handleLoadComplete();
            break;
        }
    }
    
    this.handleLoadComplete = function(event) {
        totalLoaded++;

        if(manifest.length==totalLoaded) {
        }
    }
}

MainMenu = function(stage) {
    this.show = function() {
        var startText = new Text('BEGIN!!!!!', "24px Arial", Constants.TEXT_COLOR);
        startText.maxWidth = 100;
        startText.x = stage.canvas.width/2 - startText.maxWidth/2;
        startText.y = stage.canvas.height/2;
        stage.addChild(startText);
        
        startText.onClick = function() {
            stage.removeAllChildren();
            new Game(stage);
        }
        stage.update();
    }
}

Game = function(stage) {
    var gameObjects = [];
    Globals.gameObjects = gameObjects;
    var player = new Player(stage);
    Globals.player = player;
    var levelhandler = new LevelHandler(stage, this);
    gameObjects.push(levelhandler);
	var hud = new Text("", "20px Arial", "#FFFFFF");
	hud.y = 20;
	stage.addChild(hud);
    ///* Ticker */
    var ticker = new Object();
    Ticker.setFPS(Constants.FRAME_RATE);
    //Ticker.addListener(stage);
    Ticker.addListener(ticker, false);
    //Ticker.removeListener(ticker);
    ticker.tick = function(e) {
        goog.array.forEach(
            gameObjects, function(obj) {
                if (obj.update) {
                    obj.update(e);
                }
                stage.update();
            }
        );
		hud.text = "Lives: " + Globals.player.lives + " Score: " + Globals.player.getScore() + " Health: " + Globals.player.health + " Weapon: " + "weapon name goes here";
    };
    this.addGameObject = function(obj) {
        gameObjects.push(obj);
    }
}

GameObject = function(stage, sprite, obj, opt_x, opt_y) {
    if (!sprite || !stage) {
        alert('Arg missing in GameObject(stage, sprite, opt_x, opt_y)');
    }
    if (opt_x) {
        sprite.x = opt_x;
    }
    if (opt_y) {
        sprite.y = opt_y;
    }
	this.id = ids++;
	sprite.regX = 50;
	sprite.regY = 50;
	this.health = 1;
	this.hit = function(damage) {
        this.health -= damage;
		if (this.health < 1) {
			console.log(obj.id, obj.tag);
            stage.removeChild(sprite);
            console.log(goog.array.remove(Globals.gameObjects, obj));
		}
	}
    stage.addChild(sprite);
    this.getSprite = function() { return sprite; }
	Globals.gameObjects.push(obj);
}

Player = function(stage, opt_x, opt_y) {
    var sprite = sprites.player;
	var startPt = {x:stage.canvas.width/2, y:stage.canvas.height * 0.95};
    goog.object.extend(this, new GameObject(stage, sprite, this, startPt.x, startPt.y))
    this.health = 100;
	this.lives = 3;
    var bullet_level = 1;
    var bullet_dir = 0;
    var subObjects = [];
    var fire_rate = 10;
    var last_fired = Ticker.getTicks();
    var bullet_vector = -10;
    var ship_speed = 10;
    var self = this;
    this.tag = "Player";
	var points = 0;
	this.addPoints = function(x) {
		points += x;
	}
	this.getScore = function() {return points;}
    this.getBullets = function() { return goog.array.filter(subObjects, function(obj) {
            return obj.tag == "Bullet";
        });
    }

	this.powerUp = function() {
		bullet_level++;
	}

    this.update = function(e) {
        
        /* PLAYER MOVEMENT */

        // move right, don't go past right border
        if (keydown.right && sprite.x <= (canvas.width - sprite.image.width)) {
            sprite.x += ship_speed;
        }
        
        // move left, don't go past left border
        if (keydown.left && sprite.x >= sprite.image.width) {
            sprite.x -= ship_speed;
        }

        // move up, don't go past "invisible border" just above mid-canvas
        if (keydown.up && sprite.y >= (canvas.height / 3 + sprite.image.height)) {
            sprite.y -= ship_speed;
        }

        // move down, don't go past bottom border
        if (keydown.down && sprite.y <= (canvas.height - sprite.image.height / 2)) {
            sprite.y += ship_speed;
        }

        /* BULLET POWERUPS */

        // TODO: 
        // Make powerup drop type random
        // Move "bullet_dir" to the powerup object, then assign to "bullet_level" on collision
        // 
    
        switch (bullet_level) {
            case 1:
                bullet_dir = 0;
                break;
            case 2:
                if (bullet_dir == 2) {
                    bullet_dir = -2;
                } else {
                   bullet_dir = 2;  
                }
                break;
            case 3:
                if (bullet_dir == 3) {
                    bullet_dir = -3;
                } else if (bullet_dir == -3) {
                   bullet_dir = 0;  
                } else {
                    bullet_dir =3;
                }
                break;
            default:
                bullet_dir =0;
                break;
        }

        /* SHOOTING MAD BULLETS */

        if (keydown.space && Ticker.getTicks() - last_fired >= (fire_rate / bullet_level)) {
            SoundJS.play('hit');
            subObjects.push(new Bullet(stage, sprite, bullet_dir, bullet_vector, bullet_level));
            last_fired = Ticker.getTicks();
        }

        goog.array.map(subObjects, function(obj) {
            if (obj.getSprite().x < 0 || 
                obj.getSprite().x > stage.canvas.width ||
                obj.getSprite().y < 0 ||
                obj.getSprite().y > stage.canvas.height) {
					obj.hit(1);
                    goog.array.remove(subObjects, obj);
            }
            
        });
		this.hit = function(damage) {
			this.health -= damage;
			if (this.health < 1) {
				//console.log(obj.id, obj.tag);
				//stage.removeChild(sprite);
				//goog.array.remove(Globals.gameObjects, obj);
				//Tween.get(sprite).to(startPt, 500);
				this.health = 100;
				this.lives--;
				if (this.lives < 0) {
					alert('game over assface');
					this.lives = 3;
				}
				sprite.x = startPt.x;
				sprite.y = startPt.y;
			}
		}
    }
}

PowerUp = function(stage, sprite_origin, powerup_vector) {
    var sprite = goog.object.clone(sprites.bullet);
	sprite.scaleX = 2;
	sprite.scaleY = 0.5;
    var x = Math.random() * 924 + 100;
    var y = -20;
    goog.object.extend(this, new GameObject(stage, sprite, this, x, y));
    var self = this;
    this.tag = "PowerUp";
	var scale = 0.01;
    this.update = function(e) {
		if (!enabled) return;
        sprite.y += powerup_vector;
        sprite.x = sprite.x + (5*Math.cos(sprite.y/20));
		sprite.scaleX += scale * 5;
		sprite.scaleY += scale;
		if (sprite.scaleY > 0.75 || sprite.scaleY < 0.5) {
			scale *= -1;
		}
        if (sprite.y > stage.canvas.height) {
			self.hit(1);
			return;
        }
		var playerSprite = Globals.player.getSprite();
		var pt = sprite.globalToLocal(playerSprite.x, playerSprite.y);
		if (sprite.hitTest(pt.x, pt.y)) {
			self.hit(1);
			Globals.player.powerUp();
			enabled = false;
		}
    }
	var enabled = true;
}

Bullet = function(stage, sprite_origin, bullet_x, bullet_y, bullet_level, opt_damage) {
    if (bullet_level == 1) {
    var sprite = goog.object.clone(sprites.bullet);
    } else {
      var sprite = goog.object.clone(sprites.bullet);//change the texture of the laser
    }
	sprite.scaleY = 0.25;
    var x = sprite_origin.x + sprite.image.width;
    var y = sprite_origin.y - sprite.image.height;
    var self = this;
    SoundJS.play('hit');
    this.tag = "Bullet";
    goog.object.extend(this, new GameObject(stage, sprite, this, x, y))
    this.update = function(e) {
        sprite.x += bullet_x;
        sprite.y += bullet_y;
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

BaseEnemy = function(stage, sprite, self, sprite_origin) {
	goog.object.extend(this, new GameObject(stage, sprite, self, sprite_origin.x, sprite_origin.y))
	var dead = false;
	this.damage = 10; // default damage
    var fire_rate = 10; // default fire rate
    var last_fired = Ticker.getTicks();
	this.bullet_level = 0;
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
        if (Ticker.getTicks() - last_fired >= (fire_rate / this.bullet_level)) {
            SoundJS.play('hit');
			var bullet = new Bullet(stage, self.getSprite(), 0, 10, this.bullet_level, this.damage)
			bullet.tag = "EnemyBullet";
            last_fired = Ticker.getTicks();
        }
	}
}

SpaceInvaderEnemy = function(stage, sprite_origin, bullet_vector) {
    var sprite = goog.object.clone(sprites.enemy);
    goog.object.extend(this, new BaseEnemy(stage, sprite, this, {x: sprite_origin, y: -sprite.image.height}))
    this.health = 1;
    this.ship_speed = {x: 10, y: 0};
    var self = this;
    this.tag = "SpaceInvaderEnemy";
	this.points = 500;
	this.bullet_level = 1;
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
		this.ship_speed.x = 10*Math.sin(sprite.y/60)
		this.ship_speed.y = 5;
        if (sprite.y > stage.canvas.height) {
            stage.removeChild(sprite);
            goog.array.remove(Globals.gameObjects, self);
        }
        this.baseUpdate();
    }
}
