/*jslint plusplus: true */
function Game(config) {
    "use strict";
    if (typeof config.width === "undefined"  
            || typeof config.height === "undefined") {
        throw new Error("Width and height are not provided!");
    }

    function initBoard() {
        var arr = [], i, j;
        for (i = 0; i < config.width; i++) {
            arr[i] = [];
            for (j = 0; j < config.height; j++) {
                arr[i][j] = 0;
            }
        }
        return arr;
    }

    this.config = config;
    this.board = initBoard();
}

function OutOfBoundsError(x, y) {
    "use strict";
    this.name = "OutOfBoundsError";
    this.message = "Coordinates x: " + x + " and y: " + y + " are out of board bounds";
}

OutOfBoundsError.prototype = new Error();

Game.prototype.placeLiveCell = function (x, y) {
    "use strict";
    var config = this.config;
    function validate(x, y) {
        if (x < 0 || x > config.width ||
                y < 0 || y > config.height) {
            throw new OutOfBoundsError(x, y);
        }
    }

    validate(x, y);
    this.board[x][y] = 1;
}

exports.OutOfBoundsError = OutOfBoundsError;
exports.Game = Game;