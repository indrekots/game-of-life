var game_obj = require('../app/game.js');

describe("Game", function() {
	it("should be able to be created", function() {
		var game = new game_obj.Game();
		expect(game).not.toBe(null);
	});
});