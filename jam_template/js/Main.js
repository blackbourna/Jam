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
            {src: imgDir+"paddle.png", id:"player"},
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
        new MainMenu(stage).show();
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
    var enemy = new SpaceInvaderEnemy(stage);
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
}

Player = function(stage, opt_x, opt_y) {
    var sprite = sprites.player;
    var center = Util.getCenter(stage, sprite);
    goog.object.extend(this, new GameObject(stage, sprite, center.x, stage.canvas.height * 0.75))
    var health = 1;
    var bullets = [];
    var powerups = [];
    var fire_rate = 5;
    var powerup_rate = 50;
    var last_powerup = Ticker.getTicks();
    var powerup_vector = 10; 
    var last_fired = Ticker.getTicks();
    var bullet_vector = -10;
    var ship_speed = 3;
    this.update = function(e) {
        goog.array.forEach(
            bullets, function(obj) {
                obj.update();
            }
        );
        if (keydown.right) {
            sprite.x += ship_speed;
        }
        if (keydown.left) {
            sprite.x -= ship_speed;
        }
        if (!health) {
            alert('you are now dead.');
        }
        if (keydown.space && Ticker.getTicks() - last_fired >= fire_rate) {
            SoundJS.play('hit');
            bullets.push(new Bullet(stage, sprite, bullet_vector));
                    last_fired = Ticker.getTicks();
        }
        if (Ticker.getTicks() - last_powerup >= powerup_rate){
            powerups.push(new PowerUp(stage, sprite, powerup_vector))
            last_powerup = Ticker.getTicks();
        }
        //stop at the sides
        //console.log(sprite);
        if (sprite.x >= (1024-sprite.image.width)) {
            sprite.x = 1023-sprite.image.width;
        }
        if (sprite.x <= 0) {
            sprite.x = 1;
        }
    }
    Globals.gameObjects.push(this);
}

PowerUp = function(stage, sprite_origin, powerup_vector) {
    var sprite = goog.object.clone(sprites.player);
    var x = Math.random() * 1024;
    var y = -20;
    goog.object.extend(this, new GameObject(stage, sprite, x, y))
    Globals.gameObjects.push(this);
    this.update = function(e) {
        sprite.y += powerup_vector;;
    }
}
Bullet = function(stage, sprite_origin, bullet_vector) {
    var sprite = goog.object.clone(sprites.player);
    var x = sprite_origin.x + sprite_origin.image.width/2;
    var y = sprite_origin.y - sprite_origin.image.height/2;
    goog.object.extend(this, new GameObject(stage, sprite, x, y));
    Globals.gameObjects.push(this);
    this.update = function(e) {
        sprite.y += bullet_vector;
    }
}

SpaceInvaderEnemy = function(stage, sprite_origin, bullet_vector) {
    var sprite = goog.object.clone(sprites.player);
    var center = Util.getCenter(stage, sprite);
    goog.object.extend(this, new GameObject(stage, sprite, center.x, stage.canvas.height * 0.05))
    var health = 1;
    //var bullets = [];
    //var fire_rate = 5;
    //var last_fired = Ticker.getTicks();
    //var bullet = -10;
    var ship_speed = 4;
    var horizontalDirection = 'left';

    this.update = function(e) {
        //goog.array.forEach(
        // bullets, function(obj) {
        // obj.update();
        // }
        //);

        // move the enemy left or right
        if (horizontalDirection == 'right') {
            sprite.x += ship_speed;
        }
        else if (horizontalDirection == 'left') {
            sprite.x -= ship_speed;
        }

        // check the borders, if hit, reverse the direction and move down
        if (sprite.x >= (1024 - sprite.image.width)) {
            horizontalDirection = 'left';
            sprite.y += 15;
        }
        else if (sprite.x <= 0) {
            horizontalDirection = 'right';
            sprite.y += 15;
        }

        // check bottom of sprite for collision with player
        // need brian's collision detection/global sprite shit stuff. 
    }
    Globals.gameObjects.push(this);
}
