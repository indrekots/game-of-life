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
        game.placeLiveCell(21, 43);
        expect(game.board[2][4]).toEqual(1); 
    });

    it("remove cell if placed on an existing cell", function() {
        game.placeLiveCell(24, 66);
        expect(game.board[2][6]).toEqual(1);
        game.placeLiveCell(21, 69);
        expect(game.board[2][6]).toEqual(0);
    });

    it("can not place a live cell over the left edge of the board", function() {
        expect(function() {game.placeLiveCell(-1, 3)})
            .toThrow(new game_obj.OutOfBoundsError(-1, 3));
    });

    it("can not place a live cell over the right edge of the board", function() {
        expect(function() {game.placeLiveCell(815, 3)})
            .toThrow(new game_obj.OutOfBoundsError(815, 3));
    });

    it("can not place a live cell over the top edge of the board", function() {
        expect(function() {game.placeLiveCell(2, -4)})
            .toThrow(new game_obj.OutOfBoundsError(2, -4));
    });

    it("can not place a live cell over the bottom edge of the board", function() {
        expect(function() {game.placeLiveCell(2, 633)})
            .toThrow(new game_obj.OutOfBoundsError(2, 633));

    });
});

describe("Game, when cell has been placed", function() {
    var game;
    var config = {
        canvasWidth: 800,
        canvasHeight: 600,
        cellWidth: 10,
        cellHeight: 10
    };

    beforeEach(function() {
        game = new game_obj.Game(config);
        game.placeLiveCell(24, 66);
    });

    it("cell coordinates should be in changed cells list", function() {
        expect(game.changedCells[0]).not.toBeUndefined();
        expect(game.changedCells[0].x).toEqual(2);
        expect(game.changedCells[0].y).toEqual(6);
    });
});

describe("Board", function() {
    var game;
    var config = {
        canvasWidth: 3,
        canvasHeight: 3,
        cellWidth: 1,
        cellHeight: 1
    };

    beforeEach(function() {
        game = new game_obj.Game(config);
    });

    it("cell should have 0 neigbours", function () {
        game.placeLiveCell(2, 2);
        var count = game.getNeighbourCount(2, 2);
        expect(count).toEqual(0);
    });

    it("cell should have 1 neighbour", function () {
        game.placeLiveCell(2, 1);
        game.placeLiveCell(2, 2);
        var count = game.getNeighbourCount(2, 1);
        expect(count).toEqual(1);
    }); 

    it("cell should have 2 neighbours", function() {
        game.placeLiveCell(1, 0);
        game.placeLiveCell(1, 1);
        game.placeLiveCell(1, 2);
        var count = game.getNeighbourCount(1, 1);
        expect(count).toEqual(2);        
    });
});