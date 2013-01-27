var sprites = [];
var ids = 0;
// Channelling CONTRA http://strategywiki.org/wiki/Contra/Weapons
// standardRifle = no rapid fire, have to mash the space bar to fire (can't hold down key for continuous fire)
// machineGun = rapid fire, can hold down space bar to fire continuously (find a nice balance so it's not just a wall of bullets)
// doubleGun = paired bullets from sides of ship, no continuous fire
// spread = 3 bullets fire all at once, fanning out like this -> \|/
// fireball = this might be hard -- bullet spirals like a motherfucker

Main = function() {
    /*
     * Modified version of http://active.tutsplus.com/tutorials/games/learn-createjs-by-building-an-html5-pong-game/
     */
    this.init = function() {
        /* Link Canvas */
        this.canvas = document.getElementById('canvas');
        var stage = new Stage(this.canvas);
        /* Set The Flash Plugin for browsers that don't support SoundJS */
        SoundJS.FlashPlugin.BASE_PATH = "assets/soundjs_flashplugin";
        if (!SoundJS.checkPlugin(true)) {
          alert("Error!");
          return;
        }
        var imgDir = "assets/image/";
        var sndDir = "assets/audio/";
        var manifest = [
            {src: imgDir+"spaceship_new_64.png", id:"player"},
			//{src: imgDir+"enemyship.png", id:"enemy"},
            {src: imgDir+"burger_64.png", id:"enemy"},
            {src: imgDir+"paddle.png", id:"bullet"},
            {src: imgDir+"machineGunPowerUp.png", id:"machineGun"},
            {src: imgDir+"doubleGunPowerUp.png", id:"doubleGun"},
            {src: imgDir+"spreadGunPowerUp.png", id:"spreadGun"},
            {src: imgDir+"fireballGunPowerUp.png", id:"fireballGun"},
            {src: imgDir+"background_like_a_mofo.png", id: "background"},
            {src: imgDir+"background_like_a_mofo.png", id: "background2"},
	    {src: imgDir+"title.png", id: "title"},
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
            progressText.text = event.loaded / 1 * 100 + "%"; // this makes no fucking sense
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

        if(manifest.length == totalLoaded) {
        }
    }
}

MainMenu = function(stage) {
    this.show = function() {
	var title = sprites.title;
        title.x = 40;
        title.y = 150;
        stage.addChild(title);
        
        title.onClick = function() {
            stage.removeAllChildren();
            new Game(stage);
        }
        stage.update();
    }
}

Game = function(stage) {
    var gameObjects = [];
    Globals.gameObjects = gameObjects;
    var background = new Background(stage);
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
		hud.text = "Lives: " + Globals.player.lives + " Score: " + Globals.player.getScore() + " Health: " + Globals.player.health + " Weapon: " + Globals.player.bulletInfo.name;
    };
    this.addGameObject = function(obj) {
        gameObjects.push(obj);
    }
}

Background = function(stage) {
    var sprite1 = goog.object.clone(sprites.background);
    var sprite2 = goog.object.clone(sprites.background2);
    
    var bgSprites = [sprite1, sprite2];
    
    var sprite1y = stage.canvas.height - sprite1.image.height;
    var sprite2y = stage.canvas.height - sprite2.image.height - sprite1.image.height;
    
    var background_vector = 20;
    goog.object.extend(this, new GameObject(stage, sprite1, this, 0, sprite1y, 0, 0));
    goog.object.extend(this, new GameObject(stage, sprite2, this, 0, sprite2y, 0, 0));
	
    this.update = function(e) {

        sprite1.y += background_vector;
        sprite2.y += background_vector;

        if (sprite1.y > 0) {
            sprite1.y = stage.canvas.height - sprite1.image.height;
        }
        if (sprite2.y > 0) {
            sprite2.y =  stage.canvas.height - sprite2.image.height;
        }

        //console.log(sprite1.y, sprite2.y)
    }   

    Globals.gameObjects.push(this);
    
    this.getSprite = function() { return curr; }

}

GameObject = function(stage, sprite, obj, opt_x, opt_y, opt_regX, opt_regY) {
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
	sprite.regX = opt_regX == null ? 50 : opt_regX;
	sprite.regY = opt_regY == null ? 50 : opt_regY;
	this.health = 1;
	this.hit = function(damage) {
        this.health -= damage;
		if (this.health < 1) {
			//console.log(obj.id, obj.tag);
            stage.removeChild(sprite);
            goog.array.remove(Globals.gameObjects, obj);
		}
	}
    stage.addChild(sprite);
    this.getSprite = function() { return sprite; }
	Globals.gameObjects.push(obj);
}
