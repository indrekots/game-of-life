function Game(config) {
	if (typeof config.width === "undefined"  || typeof config.height === "undefined") {
		throw new Error("Width and height are not provided!");
	}
	
	this.config = config;
	this.board = "Board";
}

exports.Game = Game;