/*jslint plusplus: true */
function Game(config) {
    if (typeof config === "undefined") {
        throw new Error("No config provided!");
    }

    function initSettings() {
        config.boardWidth = Math.floor(config.canvasWidth / config.cellWidth);
        config.boardHeight = Math.floor(config.canvasHeight / config.cellHeight);
    }

    function initBoard() {
        var arr = [], i, j;
        for (i = 0; i < config.boardWidth; i++) {
            arr[i] = [];
            for (j = 0; j < config.boardHeight; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    }


    initSettings();
    this.config = config;
    this.board = initBoard();
    this.changedCells = [];
}

Game.prototype.placeLiveCell = function (x, y) {
    var config = this.config;
    function translateCoordinates(x, y) {
        var xCoord = Math.floor(x / config.cellWidth);
        var yCoord = Math.floor(y / config.cellHeight);
        return {
            x: xCoord,
            y: yCoord
        }
    }

    function validate(point) {
        if (point.x < 0 || point.x > config.boardWidth -1  ||
                point.y < 0 || point.y > config.boardHeight -1) {
            throw new OutOfBoundsError(x, y);
        }
    }

    var point = translateCoordinates(x, y);
    validate(point);
    this.board[point.x][point.y] = 1 - this.board[point.x][point.y];
    this.changedCells.push({x: point.x, y: point.y});
    console.log("Live cell placed at: (" + point.x + ", " + point.y + ")");
}

Game.prototype.getNeighbourCount = function (x, y) {
    var neighbours = 0;
    var board = this.board;
    var rowLimit = board.length-1;
    var columnLimit = board[0].length-1;

    for(var i = Math.max(0, x-1); i <= Math.min(x+1, rowLimit); i++) {
        for(var j = Math.max(0, y-1); j <= Math.min(y+1, columnLimit); j++) {
            if(i !== x || j !== y) {
                neighbours += board[i][j];  
            }
        }
    }
    return neighbours;
}

function OutOfBoundsError(x, y) {
    this.name = "OutOfBoundsError";
    this.message = "Coordinates x: " + x + " and y: " + y + " are out of board bounds";
}

OutOfBoundsError.prototype = new Error();

exports.OutOfBoundsError = OutOfBoundsError;
exports.Game = Game;