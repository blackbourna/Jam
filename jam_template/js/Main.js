var sprites = [];
Main = function() {
    /*
     * Modified version of http://active.tutsplus.com/tutorials/games/learn-createjs-by-building-an-html5-pong-game/
     */
    this.init = function() {
        /* Link Canvas */
        
        this.canvas = document.getElementById('canvas');
        var stage = new Stage(canvas);
        stage.mouseEventsEnabled = true;
        stage.onMouseDown = function() {};
        stage.onMouseMove = function() {};
        stage.onMouseUp = function() {};
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
            {src: sndDir+"hit.mp3|"+sndDir+"/hit.ogg", id:"hit"}
        ];



        var preloader = new PreloadJS();
        preloader.installPlugin(SoundJS);
        var preloadHandler = new PreloaderHandler(manifest, stage);
        preloader.onProgress = preloadHandler.handleProgress;
        preloader.onComplete = preloadHandler.handleComplete;
        preloader.onFileLoad = preloadHandler.handleFileLoad;
        preloader.loadManifest(manifest, stage);
    }

    // Main Loop

    this.update = function() {
        alert('update');
    }
};

PreloaderHandler = function(manifest, stage) {
    var totalLoaded = 0;
    var self = this;
    var progress = 0;
    var progressText = new Text('0%', "12px Arial", "orange");
    console.log(stage);
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
        updateProgress(event);
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
    /* Ticker */
    var ticker = new Object();
    Ticker.setFPS(30);
    Ticker.addListener(this.stage);
    Ticker.addListener(tkr, false);
    Ticker.removeListener(tkr);
    ticker.tick = self.update;
}
