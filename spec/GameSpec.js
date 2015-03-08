var game_obj = require('../src/js/Game.js');

describe("Game, when created without config object", function() {
    it("should throw error when no config object is provided", function() {
        expect(function() {new game_obj.Game()})
            .toThrow(new Error("No config provided!"));
    });
});

describe("Game, when created", function() {
    var game;
    var config = {
        canvasWidth: 800,
        canvasHeight: 600,
        cellWidth: 10,
        cellHeight: 10
    };

    beforeEach(function() {
        game = new game_obj.Game(config);
    });

    it("should have required fields set", function() {
        expect(game.config.canvasWidth).toEqual(800);
        expect(game.config.canvasHeight).toEqual(600);
        expect(game.config.boardWidth).toEqual(80);
        expect(game.config.boardHeight).toEqual(60);
    });

    it("should initialize game board", function() {
        expect(game.board).not.toBeUndefined();
        expect(game.board.length).toEqual(80);
        expect(game.board[0].length).toEqual(60);
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
        canvasWidth: 800,
        canvasHeight: 600,
        cellWidth: 10,
        cellHeight: 10
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
        expect(function() {game.placeLiveCell(85, 3)})
            .toThrow(new game_obj.OutOfBoundsError(85, 3));
    });

    it("can not place a live cell over the top edge of the board", function() {
        expect(function() {game.placeLiveCell(2, -4)})
            .toThrow(new game_obj.OutOfBoundsError(2, -4));
    });

    it("can not place a live cell over the bottom edge of the board", function() {
        expect(function() {game.placeLiveCell(2, 63)})
            .toThrow(new game_obj.OutOfBoundsError(2, 63));

    });
})