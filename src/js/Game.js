/*jslint plusplus: true */
function Game(config) {
    "use strict";
    if (typeof config === "undefined") {
        throw new Error("No config provided!");
    }

    function initSettings() {
        config.boardWidth = config.canvasWidth / config.cellWidth;
        config.boardHeight = config.canvasHeight / config.cellHeight;
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
    "use strict";
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
        console.log(point);
        if (point.x < 0 || point.x > config.boardWidth ||
                point.y < 0 || point.y > config.boardHeight) {
            throw new OutOfBoundsError(x, y);
        }
    }

    var point = translateCoordinates(x, y);
    validate(point);
    this.board[point.x][point.y] = 1 - this.board[point.x][point.y];
    this.changedCells.push({x: point.x, y: point.y});
    console.log("Live cell placed at: (" + point.x + ", " + point.y + ")");
}

function OutOfBoundsError(x, y) {
    "use strict";
    this.name = "OutOfBoundsError";
    this.message = "Coordinates x: " + x + " and y: " + y + " are out of board bounds";
}

OutOfBoundsError.prototype = new Error();

exports.OutOfBoundsError = OutOfBoundsError;
exports.Game = Game;