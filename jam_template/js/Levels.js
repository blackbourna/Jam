Level = [];
for (var x = 0; x < 120000; x += Math.random() * 2500) {
    if (Math.random() > 0.15) {
        var row = [];
        for (var y = 0; y < 10; y++) {
            row.push(Math.random() > 0.15 ? 0 : 1)
        }
        Level.push(
            {
                timestamp: x,
                objects: row
            }
        );
    }
}
LevelStack = [];
for (var y = Level.length - 1; y >= 0; y--) {
    LevelStack.push(Level[y]);
}

LevelObjects = {
   OPEN: 0,
   ENEMY: 1
}

DeltaTime = 0;

LevelHandler = function(stage, game) {
    this.update = function(e) {
        //console.log(goog.array.peek(LevelStack));
        Ticker.getTicks()
        if (!LevelStack.length) {
            return;
        }
        if (goog.array.peek(LevelStack).timestamp < DeltaTime) {
            var event = LevelStack.pop();
            var tilesize = stage.canvas.width/event.objects.length;
            for (var x = 0; x < event.objects.length; x++) {
                switch (event.objects[x]) {
                    case LevelObjects.ENEMY:
                        var enemy = new Enemy(stage, x * tilesize);
                        stage.addChild(enemy.sprite);
                        game.addGameObject(enemy);
                    break;
                }
            }
        }
        DeltaTime += Ticker.getTicks();
    }
}
