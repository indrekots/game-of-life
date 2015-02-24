var game_obj = require('../app/game.js');

describe("Game, when created", function() {
	it("should throw error when canvas width and height are not provided", function() {
		expect(function() {new game_obj.Game({})})
			.toThrow(new Error("Width and height are not provided!"));
	});

	it("should have width and height set when provided", function() {
		var config = {
			width: 800,
			height: 600
		};
		var game = new game_obj.Game(config);
		expect(game.config.width).toEqual(800);
		expect(game.config.height).toEqual(600);
	});
});