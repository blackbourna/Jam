var sprites = [];
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
    };
    this.addGameObject = function(obj) {
        gameObjects.push(obj);
    }
}


GameObject = function(stage, sprite, opt_x, opt_y) {
    if (!sprite || !stage) {
        alert('Arg missing in GameObject(stage, sprite, opt_x, opt_y)');
    }
    if (opt_x) {
        sprite.x = opt_x;
    }
    if (opt_y) {
        sprite.y = opt_y;
    }
    stage.addChild(sprite);
    this.getSprite = function() { return sprite; }
}

Player = function(stage, opt_x, opt_y) {
    var sprite = sprites.player;
    var center = Util.getCenter(stage, sprite);
    goog.object.extend(this, new GameObject(stage, sprite, center.x, stage.canvas.height * 0.75))
    var health = 1;
    var bullet_level = 1;
    var bullet_dir = 0;
    var subObjects = [];
    var fire_rate = 20;
    var last_fired = Ticker.getTicks();
    var bullet_vector = -10;
    var ship_speed = 5;
    var self = this;
    this.tag = "Player";
    this.getBullets = function() { return goog.array.filter(subObjects, function(obj) {
            return obj.tag == "Bullet";
        });
    }

    this.update = function(e) {
        if (keydown.right && sprite.x <= (1024-sprite.image.width)) {
            sprite.x += ship_speed;
        }
        if (keydown.left && sprite.x >= 0) {
            sprite.x -= ship_speed;
        }
        if (!health) {
            alert('you are now dead.');
        }
        
    
        switch (bullet_level) {
            case 1:
                bullet_dir = 0;
                break;
            case 2:
                if (bullet_dir==2){
                    bullet_dir = -2;
                } else {
                   bullet_dir = 2;  
                }
                break;
            case 3:
                if (bullet_dir == 3){
                    bullet_dir = -3;
                } else if (bullet_dir == -3){
                   bullet_dir = 0;  
                } else {
                    bullet_dir =3;
                }
                break;
            default:
                bullet_dir =0;
                break;
        }
        if (keydown.space && Ticker.getTicks() - last_fired >= (fire_rate /bullet_level)) {
            SoundJS.play('hit');
            //subObjects.push(new Bullet(stage, sprite, null));
            //subObjects.push(new Bullet(stage, sprite, null));
            subObjects.push(new Bullet(stage, sprite, bullet_vector, bullet_dir, bullet_level));
            last_fired = Ticker.getTicks();
        }
        goog.array.map(subObjects, function(obj) {
            if (obj.getSprite().x < 0 || 
                obj.getSprite().x > stage.canvas.width ||
                obj.getSprite().y < 0 ||
                obj.getSprite().y > stage.canvas.height) {
                    stage.removeChild(obj.getSprite());
                    goog.array.remove(subObjects, obj);
                    goog.array.remove(Globals.gameObjects, obj);
            }
            
        });
        //if (keydown.up) {
        //    sprite.y -= 1;
        //}
        //if (keydown.down) {
        //    sprite.y += 1;
        //}
    }
    Globals.gameObjects.push(this);
}

PowerUp = function(stage, sprite_origin, powerup_vector) {
    var sprite = goog.object.clone(sprites.player);
    var x = Math.random() * 924 + 100;
    var y = -20;
    goog.object.extend(this, new GameObject(stage, sprite, x, y));
    var self = this;
    this.tag = "PowerUp";
    this.update = function(e) {
        sprite.y += powerup_vector;
        sprite.x = sprite.x + (5*Math.cos(sprite.y/60));
        if (sprite.y > stage.canvas.height) {
            stage.removeChild(sprite);
            goog.array.remove(Globals.gameObjects, self);
        }
    }
    
    Globals.gameObjects.push(this);
}

Bullet = function(stage, sprite_origin, bullet_vector, bullet_dir, bullet_level) {
    if (bullet_level == 1) {
    var sprite = goog.object.clone(sprites.bullet);
    } else {
      var sprite = goog.object.clone(sprites.bullet);//change the texture of the laser
    }
    var x = sprite_origin.x + sprite_origin.image.width/2;
    var y = sprite_origin.y - sprite_origin.image.height/2;
    var self = this;
    SoundJS.play('hit');
    this.tag = "Bullet";
    goog.object.extend(this, new GameObject(stage, sprite, x, y))
    this.update = function(e) {
        sprite.x+= bullet_dir;
        sprite.y += bullet_vector;
        if (sprite.x < 0 || 
            sprite.x > stage.canvas.width ||
            sprite.y < 0 ||
            sprite.y > stage.canvas.height) {
            stage.removeChild(sprite);
            goog.array.remove(Globals.gameObjects, self);
        }
    }
    Globals.gameObjects.push(this);
}

SpaceInvaderEnemy = function(stage, sprite_origin, bullet_vector) {
    var sprite = goog.object.clone(sprites.player);
    var center = Util.getCenter(stage, sprite);
    goog.object.extend(this, new GameObject(stage, sprite, center.x, stage.canvas.height * 0.05))
    var health = 1;
    var ship_speed = {x: 10, y: 100};
    var self = this;
    this.tag = "SpaceInvaderEnemy";
    this.update = function(e) {
        sprite.x -= ship_speed.x;

        // check the borders, if hit, reverse the direction and move down
        if (sprite.x >= (1024 - sprite.image.width) || sprite.x <= 0) {
            ship_speed.x *= -1;
            sprite.y += ship_speed.y;
        }
        
        if (sprite.y > stage.canvas.height) {
            stage.removeChild(sprite);
            goog.array.remove(Globals.gameObjects, self);
        }
        var bullets = Globals.player.getBullets();
        goog.array.map(bullets, function(obj) {
            var bulletSprite = obj.getSprite();
            var pt = sprite.globalToLocal(bulletSprite.x, bulletSprite.y);
            //console.log(bulletSprite.x, bulletSprite.y, obj.getSprite());
            if (sprite.hitTest(pt.x, pt.y)) {
                stage.removeChild(sprite);
                goog.array.remove(Globals.gameObjects, self);
            }
        });
    }
    Globals.gameObjects.push(this);
}
Enemy = function(stage, opt_x, opt_y) {
    var sprite = goog.object.clone(sprites.player);
    var self = this;
    goog.object.extend(this, new GameObject(stage, sprite, opt_x, -sprite.image.height));
    this.tag = "Enemy";
    this.update = function(e) {
        sprite.y += 10;
        if (sprite.y > stage.canvas.height) {
            stage.removeChild(sprite);
            goog.array.remove(Globals.gameObjects, self);
        }
        var bullets = Globals.player.getBullets();
        goog.array.map(bullets, function(obj) {
            var bulletSprite = obj.getSprite();
            var pt = sprite.globalToLocal(bulletSprite.x, bulletSprite.y);
            //console.log(bulletSprite.x, bulletSprite.y, obj.getSprite());
            if (sprite.hitTest(pt.x, pt.y)) {
                stage.removeChild(sprite);
                goog.array.remove(Globals.gameObjects, self);
            }
        });
    }
    Globals.gameObjects.push(this);
}
