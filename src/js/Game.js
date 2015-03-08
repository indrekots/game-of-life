/*jslint plusplus: true */
function Game(config) {
    "use strict";
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

    if (typeof config === "undefined") {
        throw new Error("No config provided!");
    }

    initSettings();
    this.config = config;
    this.board = initBoard();
}

Game.prototype.placeLiveCell = function (x, y) {
    "use strict";
    var config = this.config;
    function validate(x, y) {
        if (x < 0 || x > config.boardWidth ||
                y < 0 || y > config.boardHeight) {
            throw new OutOfBoundsError(x, y);
        }
    }

    validate(x, y);
    this.board[x][y] = 1;
}

function OutOfBoundsError(x, y) {
    "use strict";
    this.name = "OutOfBoundsError";
    this.message = "Coordinates x: " + x + " and y: " + y + " are out of board bounds";
}

OutOfBoundsError.prototype = new Error();

exports.OutOfBoundsError = OutOfBoundsError;
exports.Game = Game;