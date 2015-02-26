var game_obj = require('../app/game.js');

describe("Game, when created without config object", function() {
	it("should throw error when canvas width and height are not provided", function() {
		expect(function() {new game_obj.Game({})})
			.toThrow(new Error("Width and height are not provided!"));
	});
});

describe("Game, when created", function() {
	var game;
	var config = {
		width: 800,
		height: 600
	};

	beforeEach(function() {
		game = new game_obj.Game(config);
	});

	it("should have width and height set", function() {
		expect(game.config.width).toEqual(800);
		expect(game.config.height).toEqual(600);
	});

	it("should initialize game board", function() {
		expect(game.board).not.toBeUndefined();
	});
});