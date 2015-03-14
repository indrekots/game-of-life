var game_obj = require('../src/js/Game.js');

describe("Game, when created without config object", function() {
    it("should throw error", function() {
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

describe("Game, when cell has been toggled", function() {
    var game;
    var config = {
        canvasWidth: 800,
        canvasHeight: 600,
        cellWidth: 10,
        cellHeight: 10
    };

    beforeEach(function() {
        game = new game_obj.Game(config);
        game.toggleCell(24, 66);
    });

    it("cell coordinates should be in changed cells list", function() {
        expect(game.changedCells[0]).not.toBeUndefined();
        expect(game.changedCells[0].x).toEqual(2);
        expect(game.changedCells[0].y).toEqual(6);
    });
});

describe("When generating the next generation", function() {
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

    it("live cell with 0 live neighbours should die of under-population", function() {
        game.placeLiveCell(24, 208);
        game.nextGeneration();
        expect(game.board[2][20]).toEqual(0);
    });

    it("cell died of under-population (0 neighours) should be in changedCells", function() {
        game.placeLiveCell(24, 208);
        game.nextGeneration();
        expect(game.changedCells.length).toEqual(1);
        var change = game.changedCells.shift();
        expect(change.x).toEqual(2);
        expect(change.y).toEqual(20);    
    });

    it("live cell with 1 live neighbour should die of under-population", function() {
        game.placeLiveCell(15, 18);
        game.placeLiveCell(12, 27);
        game.nextGeneration();
        expect(game.board[1][1]).toEqual(0);
        expect(game.board[1][2]).toEqual(0);
    });

    it("2 live neighbours should be in changedCells when dying of under-population", function() {
        game.placeLiveCell(15, 18);
        game.placeLiveCell(12, 27);
        game.nextGeneration();
        expect(game.changedCells.length).toEqual(2);
        expect(game.changedCells.shift()).toEqual({x: 1, y: 1});
        expect(game.changedCells.shift()).toEqual({x: 1, y: 2});
    });

    it("live cell with 2 live neighbours should live on to the next generation", function() {
        game.placeLiveCell(5, 9);
        game.placeLiveCell(18, 7);
        game.placeLiveCell(2, 11);
        game.nextGeneration();
        expect(game.board[0][0]).toEqual(1);
    });

    it("with a cell with 2 neighbours, 1 records should be in changedCells", function() {
        game.placeLiveCell(5, 9);
        game.placeLiveCell(18, 7);
        game.placeLiveCell(2, 11);
        game.nextGeneration();
        expect(game.changedCells.length).toEqual(1); 
        expect(game.changedCells.shift()).toEqual({x: 1, y: 1});   
    });

    it("live cell with 3 live neighbours should live on to the next generation", function() {
        game.placeLiveCell(5, 9);
        game.placeLiveCell(18, 7);
        game.placeLiveCell(2, 11);
        game.placeLiveCell(15, 16);
        game.nextGeneration();
        expect(game.board[0][0]).toEqual(1);
    });

    it("with a cell with 3 neighbours, no records should be in changedCells", function() {
        game.placeLiveCell(5, 9);
        game.placeLiveCell(18, 7);
        game.placeLiveCell(2, 11);
        game.placeLiveCell(15, 16);
        game.nextGeneration();
        expect(game.changedCells.length).toEqual(0);   
    });

    it("live cell with more than 3 live neighbours should die of overcrowding", function() {
        game.placeLiveCell(45, 23);
        game.placeLiveCell(53, 24);
        game.placeLiveCell(32, 27);
        game.placeLiveCell(41, 17);
        game.placeLiveCell(46, 37);
        game.nextGeneration();
        expect(game.board[4][2]).toEqual(0);
    });

    it("with a cell with 4 neighours, 5 records should be in changedCells", function() {
        game.placeLiveCell(45, 23);
        game.placeLiveCell(53, 24);
        game.placeLiveCell(32, 27);
        game.placeLiveCell(41, 17);
        game.placeLiveCell(46, 37);
        game.nextGeneration();
        expect(game.changedCells.length).toEqual(5);  
        expect(game.changedCells.shift()).toEqual({x: 3, y: 1});
        expect(game.changedCells.shift()).toEqual({x: 3, y: 3});
        expect(game.changedCells.shift()).toEqual({x: 4, y: 2});
        expect(game.changedCells.shift()).toEqual({x: 5, y: 1});
        expect(game.changedCells.shift()).toEqual({x: 5, y: 3});  
    });

    it("dead cell with exactly 3 live neighbours should become a live cell, as if by reproduction", function() {
        game.placeLiveCell(23, 34);
        game.placeLiveCell(5, 32);
        game.placeLiveCell(14, 46);
        game.nextGeneration();
        expect(game.board[1][3]).toEqual(1);
    });
});

describe("Board", function() {
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

    it("cell should have 0 neigbours", function () {
        game.placeLiveCell(22, 29);
        var count = game.getNeighbourCount(2, 2);
        expect(count).toEqual(0);
    });

    it("cell should have 1 neighbour", function () {
        game.placeLiveCell(24, 101);
        game.placeLiveCell(29, 118);
        var count = game.getNeighbourCount(2, 10);
        expect(count).toEqual(1);
    }); 

    it("cell should have 2 neighbours", function() {
        game.placeLiveCell(101, 8);
        game.placeLiveCell(107, 14);
        game.placeLiveCell(105, 28);
        var count = game.getNeighbourCount(10, 1);
        expect(count).toEqual(2);        
    });

    it("cell should have 3 neighbours", function() {
        game.placeLiveCell(340, 78);
        game.placeLiveCell(355, 76);
        game.placeLiveCell(332, 73);
        game.placeLiveCell(331, 87);
        var count = game.getNeighbourCount(34, 7);
        expect(count).toEqual(3);
    });

    it("cell should have 4 neighbours", function() {
        game.placeLiveCell(340, 78);
        game.placeLiveCell(355, 76);
        game.placeLiveCell(332, 73);
        game.placeLiveCell(331, 87);
        game.placeLiveCell(338, 65);
        var count = game.getNeighbourCount(34, 7);
        expect(count).toEqual(4);
    });

    it("cell should have 5 neighbours", function() {
        game.placeLiveCell(340, 78);
        game.placeLiveCell(355, 76);
        game.placeLiveCell(332, 73);
        game.placeLiveCell(331, 87);
        game.placeLiveCell(338, 65);
        game.placeLiveCell(344, 61);
        var count = game.getNeighbourCount(34, 7);
        expect(count).toEqual(5);
    });

    it("cell should have 6 neighbours", function() {
        game.placeLiveCell(340, 78);
        game.placeLiveCell(355, 76);
        game.placeLiveCell(332, 73);
        game.placeLiveCell(331, 87);
        game.placeLiveCell(338, 65);
        game.placeLiveCell(344, 61);
        game.placeLiveCell(357, 69);
        var count = game.getNeighbourCount(34, 7);
        expect(count).toEqual(6);
    });

    it("cell should have 7 neighbours", function() {
        game.placeLiveCell(340, 78);
        game.placeLiveCell(355, 76);
        game.placeLiveCell(332, 73);
        game.placeLiveCell(331, 87);
        game.placeLiveCell(338, 65);
        game.placeLiveCell(344, 61);
        game.placeLiveCell(357, 69);
        game.placeLiveCell(342, 81);
        var count = game.getNeighbourCount(34, 7);
        expect(count).toEqual(7);
    });

    it("cell should have 8 neighbours", function() {
        game.placeLiveCell(340, 78);
        game.placeLiveCell(355, 76);
        game.placeLiveCell(332, 73);
        game.placeLiveCell(331, 87);
        game.placeLiveCell(338, 65);
        game.placeLiveCell(344, 61);
        game.placeLiveCell(357, 69);
        game.placeLiveCell(342, 81);
        game.placeLiveCell(357, 87);
        var count = game.getNeighbourCount(34, 7);
        expect(count).toEqual(8);
    });
});