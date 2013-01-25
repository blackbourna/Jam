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
    var player = new Player(stage);
    var gameObjects = [];
    gameObjects.push(player);
    ///* Ticker */
    var ticker = new Object();
    Ticker.setFPS(60);
    //Ticker.addListener(stage);
    Ticker.addListener(ticker, false);
    //Ticker.removeListener(ticker);
    ticker.tick = function() {
        goog.array.forEach(
            gameObjects, function(obj) {
                if (obj.update) {
                    obj.update();
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
    this.update = function(e) {
        if (keydown.right) {
            sprite.x += 1;
        }
        if (keydown.left) {
            sprite.x -= 1;
        }
        if (true) {
        }
        //if (keydown.up) {
        //    sprite.y -= 1;
        //}
        //if (keydown.down) {
        //    sprite.y += 1;
        //}
    }
}
