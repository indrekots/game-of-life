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

Game.prototype.placeLiveCell = function(x, y) {
	var config = this.config;
	validate(x, y);
	this.board[x][y] = 1;


	function validate(x, y) {
		if (x < 0) throw new OutOfBoundsError(x, y);
		if (x > config.width) throw new OutOfBoundsError(x, y);
		if (y < 0) throw new OutOfBoundsError(x, y);
		if (y > config.height) throw new OutOfBoundsError(x, y);
	}
}

function OutOfBoundsError(x, y) {
	this.name = "OutOfBoundsError";
	this.message = "Coordinates x: " + x + " and y: " + y + " are out of board bounds";
}

OutOfBoundsError.prototype = new Error();

exports.OutOfBoundsError = OutOfBoundsError;
exports.Game = Game;