LevelObjects = {
   OPEN: 0,
   ENEMY: 1,
   SPACE_INVADER_ENEMY: 2,
   POWER_UP: 3
}
var LevelObjectsLength = Util.getObjectLength(LevelObjects);
Level = [];
var gameLength = 15;
//var gameSpeed = 25;
var objProbability = 0.5;
var probabilityStep = 0.1;
for (var x = 0; x < gameLength; x += 1.5) {//Math.random() * (gameSpeed -= 0.001)) {
    if (Math.random() < objProbability) {
        var row = [];
        for (var y = 0; y < 10; y++) {
            row.push(Math.min(Math.floor(Math.random() * (LevelObjectsLength)), LevelObjectsLength));
        }
        Level.push(
            {
                timestamp: x * 1e4 + (Math.random() * 50),
                objects: row
            }
        );
    }
    //objProbability += probabilityStep;
}
console.log(Level);
LevelStack = [];
for (var y = Level.length - 1; y >= 0; y--) {
    LevelStack.push(Level[y]);
}
console.log(LevelStack);
DeltaTime = 0;

LevelHandler = function(stage, game) {
    this.update = function(e) {
        Ticker.getTicks()
        if (!LevelStack.length) {
            return;
        }
        if (goog.array.peek(LevelStack).timestamp < DeltaTime) {
            var event = LevelStack.pop();
            var tilesize = stage.canvas.width/event.objects.length;
            for (var x = 0; x < event.objects.length; x++) {
                var obj = null;
                switch (event.objects[x]) {
                    case LevelObjects.ENEMY:
                        obj = new Enemy(stage, x * tilesize);
                    break;
                    case LevelObjects.SPACE_INVADER_ENEMY:
                        obj = new SpaceInvaderEnemy(stage, x * tilesize);
                    break;
                    case LevelObjects.POWER_UP:
                        obj = new PowerUp(stage, x * tilesize, Math.random() * 5);
                    break;
                }
                if (obj) {
                    stage.addChild(obj.sprite);
                    game.addGameObject(obj);
                }
            }
        }
        DeltaTime += Ticker.getTicks();
    }
}
