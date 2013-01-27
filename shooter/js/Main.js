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
            {src: imgDir+"spaceship_new_64.png", id:"player"},
			//{src: imgDir+"enemyship.png", id:"enemy"},
            {src: imgDir+"burger_64.png", id:"enemy"},
            {src: imgDir+"paddle.png", id:"bullet"},
            {src: imgDir+"machineGunPowerUp.png", id:"machineGun"},
            {src: imgDir+"doubleGunPowerUp.png", id:"doubleGun"},
            {src: imgDir+"spreadGunPowerUp.png", id:"spreadGun"},
            {src: imgDir+"fireballGunPowerUp.png", id:"fireballGun"},
            {src: imgDir+"background_like_a_mofo.png", id: "background"},
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

        if(manifest.length == totalLoaded) {
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
    var sprite = sprites.background;
	//sprite.scaleX = 1.1;
    var y = -sprite.image.height+stage.canvas.height;
    var x = 0;
    var background_vector = 4;
    var superawesomevariableCheese = 1.01;
    var notsoawesomeFormage = 1.1;
    goog.object.extend(this, new GameObject(stage, sprite, this, x, y, 0, 0));
	sprite.setTransform(x, y, 2.1);
	var xSum = 0;
    this.update = function(e){

		sprite.x = -Math.abs(Math.cos(sprite.y/50)) * 2;
		notsoawesomeFormage *= superawesomevariableCheese;
        notsoawesomeFormage = notsoawesomeFormage > 100 ? 1:notsoawesomeFormage;
        sprite.y += Math.abs(Math.cos(sprite.y/100))*notsoawesomeFormage;
        if (sprite.y > 0) {
            sprite.y = -sprite.image.height+stage.canvas.height;
        }
		sprite.y += background_vector;
    }   

    Globals.gameObjects.push(this);
    this.getSprite = function() { return sprite; }

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
