LevelObjects = {
   OPEN: 0,
   ENEMY: 1,
   SPACE_INVADER_ENEMY: 2,
   POWER_UP: 3
}
var levelObjectsLength = Util.getObjectLength(LevelObjects);

var deltaTime = 0;
var delay = 50;
var enemyFactor = 0.5;
LevelHandler = function(stage, game) {
    this.update = function(e) {
		var row = null;
        if (Ticker.getTicks() - deltaTime >= delay) {
			row = new Array(Math.floor(Math.random() * 10));
			for (var x = 0; x < row.length; x++) {
				if (Math.random() > enemyFactor) {
					enemyFactor -= 1e-2;
					row[x] = Math.floor(Math.random() * levelObjectsLength + 1);
				}
			}
			deltaTime = Ticker.getTicks();
		} else {
			return;
		}
		var tilesize = stage.canvas.width/row.length;
		for (var x = 0; x < row.length; x++) {
			var obj = null;
			switch (row[x]) {
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
}
