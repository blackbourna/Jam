Main = function() {
    /*
     * Modified version of http://active.tutsplus.com/tutorials/games/learn-createjs-by-building-an-html5-pong-game/
     */
    this.init = function() {
        /* Link Canvas */
        
        this.canvas = document.getElementById('canvas');
        this.stage = new Stage(canvas);
        this.stage.mouseEventsEnabled = true;
        
        /* Set The Flash Plugin for browsers that don't support SoundJS */
        SoundJS.FlashPlugin.BASE_PATH = "assets/soundjs_flashplugin";
        if (!SoundJS.checkPlugin(true)) {
          alert("Error!");
          return;
        }
        var manifest = [
                    {src:"assets/image/paddle.png", id:"player"},
                    {src:"assets/audio/hit.mp3|assets/audio/hit.ogg", id:"hit"}
                ];



        var preloader = new PreloadJS();
        preloader.installPlugin(SoundJS);
        var preloadHandler = new PreloaderHandler(manifest);
        preloader.onProgress = preloadHandler.handleProgress;
        preloader.onComplete = preloadHandler.handleComplete;
        preloader.onFileLoad = preloadHandler.handleFileLoad;
        preloader.loadManifest(manifest);

        /* Ticker */
        
        Ticker.setFPS(30);
        Ticker.addListener(this.stage);
    }

    // Main Loop

    this.update = function() {
    }
};

PreloaderHandler = function(manifest) {
    var totalLoaded = 0;
    var self = this;
    this.handleProgress = function(event) {
        //use event.loaded to get the percentage of the loading
    }

    this.handleComplete = function (event) {
        //triggered when all loading is complete
    }

    this.handleFileLoad = function(event) {
        //triggered when an individual file completes loading

        switch(event.type) {
            case PreloadJS.IMAGE:
                //image loaded
                var img = new Image();
                img.src = event.src;
                img.onload = self.handleLoadComplete;
                window[event.id] = new Bitmap(img);
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
            alert('yay');
        }
    }
}
