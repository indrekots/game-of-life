var game_obj = require('../app/game.js');

describe("Game", function() {
	it("should throw error when canvas width and height are not provided", function() {
		expect(function() {new game_obj.Game({})})
			.toThrow(new Error("Width and height are not provided!"));
	});
});