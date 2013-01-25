Util = {
    getCenter: function(stage, sprite) {
        var xCoord = stage.canvas.width/2 - sprite.image.width/2;
        var yCoord = stage.canvas.height/2 - sprite.image.height/2;
        return {x: xCoord, y: yCoord};
    }
}
