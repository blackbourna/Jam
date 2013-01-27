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
	    {src: imgDir+"0.png", id:"frame0"},
	    {src: imgDir+"1.png", id:"frame1"},
            {src: imgDir+"2.png", id:"frame2"},
	    {src: imgDir+"3.png", id:"frame3"},
	    {src: imgDir+"4.png", id:"frame4"}
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
Game = function(stage) {
    var gameObjects = [];
    Globals.gameObjects = gameObjects;
    var kicker = new Kicker(stage);
    Globals.kicker = kicker;
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
	sprite.regX = 0;
	sprite.regY = 0;
	this.health = 1;
	this.hit = function(damage) {
        this.health -= damage;
		if (this.health < 1) {
			console.log(obj.id, obj.tag);
            stage.removeChild(sprite);
            goog.array.remove(Globals.gameObjects, obj);
		}
	}
    stage.addChild(sprite);
    this.getSprite = function() { return sprite; }
}
Kicker = function(stage){
    var sprite = sprites.frame0;
    var center = Util.getCenter(stage, sprite);

    this.update = function(e) {
        if (keydown.space) {
	    //next frame?  rotate kicker?
            
        }
	
    }
    goog.object.extend(this, new GameObject(stage, sprite, this, 0, 0 ));
    Globals.gameObjects.push(this);
}