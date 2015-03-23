var game;
var stage;
function GameRunner(config) {
    function validateInput() {
        if (typeof config === "undefined") {
            throw new Error("No config provided!");
        }
        if (typeof config.game === "undefined") {
            throw new Error("Instance of a game not provided");
        }
        if (typeof config.renderer === "undefined") {
            throw new Error("Instance of a renderer not provided");
        }
    }

    validateInput();
    this.game = config.game;
    this.renderer = config.renderer;
}

GameRunner.prototype.init = function() {
    this.stage = new this.renderer.Stage("myCanvas");
    this.stage.on("stagemousedown", function(event) {
        this.game.toggleCell(event.stageX + 20, event.stageY + 20);
        refresh();
    });

    this.renderer.Ticker.interval = 1000;
    this.renderer.Ticker.paused = true;
    this.renderer.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
        if (!event.paused) {
            this.game.nextGeneration();
            refresh();  
        }
    }    
}

GameRunner.prototype.refresh = function() {
    function isInView(point) {
        return point.x >= 2 && point.x <= game.config.boardWidth -2 
            && point.y >= 2 && point.y <= game.config.boardHeight - 2;
    }

    for (var i = 0; i < this.game.changedCells.length; i++) {
        var p = this.game.changedCells[i];
        if (isInView(p)) {
            if (this.game.board[p.x][p.y] === 1) {
                addCell(p.x, p.y);    
            }
            else {
                removeCell(p.x, p.y);
            }
        }
    }    
    this.game.changedCells = [];
    this.stage.update();    
}

function init() {
    game = new Game({
        canvasWidth: 800,
        canvasHeight: 600,  
        cellWidth: 10,
        cellHeight: 10
    });

    stage = new createjs.Stage("myCanvas");
    stage.on("stagemousedown", function(event) {
        game.toggleCell(event.stageX + 20, event.stageY + 20);
        refresh();
    });

    createjs.Ticker.interval = 1000;
    createjs.Ticker.paused = true;
    createjs.Ticker.addEventListener("tick", handleTick);
    function handleTick(event) {
        if (!event.paused) {
            game.nextGeneration();
            refresh();  
        }
    }
}

function refresh() {
    for (var i = 0; i < game.changedCells.length; i++) {
        var p = game.changedCells[i];
        if (isInView(p)) {
            if (game.board[p.x][p.y] === 1) {
                addCell(p.x, p.y);    
            }
            else {
                removeCell(p.x, p.y);
            }
        }
    }    
    game.changedCells = [];
    stage.update();
}

function isInView(point) {
    return point.x >= 2 && point.x <= game.config.boardWidth -2 
        && point.y >= 2 && point.y <= game.config.boardHeight - 2;
}

function addCell(x, y) {
    stage.addChild(drawCell(x, y, "#000000"));
}

function removeCell(x, y) {
    stage.addChild(drawCell(x, y, "#ffffff"));
}

function drawCell(x, y, color) {
    var cell = new createjs.Shape();
    var cellWidth = game.config.cellWidth;
    var cellHeight = game.config.cellHeight;
    cell.graphics.beginFill(color).drawRect((x - 2) * cellWidth, (y - 2) * cellHeight, cellWidth, cellHeight);
    return cell;
}

exports.GameRunner = GameRunner;