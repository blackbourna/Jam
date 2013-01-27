Player = function(stage, opt_x, opt_y) {
    var sprite = sprites.player;
	var startPt = {x:stage.canvas.width/2, y:stage.canvas.height * 0.95};
    goog.object.extend(this, new GameObject(stage, sprite, this, startPt.x, startPt.y))
    this.health = 100;
	this.bulletInfo = BulletInfo[0];
	this.lives = 3;
    var subObjects = [];
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

	this.powerUp = function(level, powerUpSpriteName) {
		this.bulletInfo = BulletInfo[level];
	}

    this.update = function(e) {
        var canvas = stage.canvas;

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
        
        //switch (bullet_type) {
        //    case "machineGun": // this gun is awesome, and we should figure out how to keep it in
        //        fire_rate = 0.1;
        //        if (bullet_dir == 2) {
        //            bullet_dir = -2;
		//			// potential structure like this for design bullet types?
		//			for (var b in bulletInfo[bulletLevel]) {
		//				
		//			}
        //        } else {
        //            bullet_dir = 2;  
        //        }
        //        break;
        //    case "doubleGun":
        //        fire_rate = 10;
        //        if (bullet_dir == 3) {
        //            bullet_dir = -3;
        //        } else if (bullet_dir == -3) {
        //           bullet_dir = 0;  
        //        } else {
        //            bullet_dir =3;
        //        }
        //        break;
        //    case "spreadGun": 
        //        fire_rate = 10;
        //        break;
        //    case "fireballGun":
        //        fire_rate = 10;
        //        break;
        //    default:    // standardGun
        //        fire_rate = 10;
        //        bullet_dir =0;
        //        break;
        //}

        /* SHOOTING MAD BULLETS */

        if (keydown.space && Ticker.getTicks() - last_fired >= this.bulletInfo.rate) {
            //console.log("bulletType ", this.bulletInfo);

			for (var i = 0; i < this.bulletInfo.x.length; i++) {
				var bulletX = this.bulletInfo.x[i];
				var bulletY = this.bulletInfo.y[i];

				subObjects.push(new Bullet(stage, sprite, bulletX, bulletY, this.bulletInfo.damage, this.bulletInfo.sfx));
				var audio = new Audio(sndDir+"sfx/"+this.bulletInfo.sfx+".wav").play();
				//console.log(sndDir+"sfx/"+this.bulletInfo.sfx+".wav");
				//audio.play();
			}
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
					alert('thank you for playing :D');

					this.lives = 3;
				}
				sprite.x = startPt.x;
				sprite.y = startPt.y;
			}
		}
    }
}
