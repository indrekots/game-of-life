var game_obj = require('../src/js/Game.js');

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
		expect(game.board.length).toEqual(800);
		expect(game.board[0].length).toEqual(600);
	});

	it("should have an empty board", function() {
		sumArray = function(arr) {
			return arr.reduce(function(a, b) {
				if (a instanceof Array) a = sumArray(a);
				if (b instanceof Array) b = sumArray(b);
				return a + b;
			});
		}

		expect(sumArray(game.board)).toEqual(0);
	});
});

describe("Game", function() {
	var game;
	var config = {
		width: 800,
		height: 600
	};

	beforeEach(function() {
		game = new game_obj.Game(config);
	});

	it("can place a live cell", function() {
		game.placeLiveCell(2, 4);
		expect(game.board[2][4]).toEqual(1); 
	});

	it("can not place a live cell over the left edge of the board", function() {
		expect(function() {game.placeLiveCell(-1, 3)})
			.toThrow(new game_obj.OutOfBoundsError(-1, 3));
	});

	it("can not place a live cell over the right edge of the board", function() {
		expect(function() {game.placeLiveCell(config.width + 5, 3)})
			.toThrow(new game_obj.OutOfBoundsError(config.width + 5, 3));
	});

	it("can not place a live cell over the top edge of the board", function() {
		expect(function() {game.placeLiveCell(2, -4)})
			.toThrow(new game_obj.OutOfBoundsError(2, -4));
	});

	it("can not place a live cell over the bottom edge of the board", function() {
		expect(function() {game.placeLiveCell(2, config.height + 3)})
			.toThrow(new game_obj.OutOfBoundsError(2, config.height + 3));

	});
})