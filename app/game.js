function Game(config) {
	if (typeof config.width === "undefined"  || typeof config.height === "undefined") {
		throw new Error("Width and height are not provided!");
	}

	initBoard = function() {
	    var arr = [];
	    for(i = 0; i < config.width; i++) {
	        arr[i] = [];
	        for(j = 0; j < config.height; j++) {
	            arr[i][j] = 0;
	        }
	    }
	    return arr;
	}
	
	this.config = config;
	this.board = initBoard();
}

exports.Game = Game;