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
    this.config = config;
}

GameRunner.prototype.init = function() {
    this.stage = new this.renderer.Stage(this.config.canvasId);
    this.stage.on("stagemousedown", function(event) {
        this.game.toggleCell(event.stageX + 20, event.stageY + 20);
        this.refresh();
    });

    this.renderer.Ticker.interval = this.config.refreshInterval;
    this.renderer.Ticker.paused = this.config.paused;
    this.renderer.Ticker.addEventListener("tick", function(event) {
        if (!event.paused) {
            this.game.nextGeneration();
            this.refresh();  
        }    
    });
}

GameRunner.prototype.refresh = function() {
    var _this = this;
    function isInView(point) {
        return point.x >= 2 && point.x <= _this.game.config.boardWidth -2 
            && point.y >= 2 && point.y <= _this.game.config.boardHeight - 2;
    }

    for (var i = 0; i < this.game.changedCells.length; i++) {
        var p = this.game.changedCells[i];
        if (isInView(p)) {
            if (this.game.board[p.x][p.y] === 1) {
                this.addCell(p.x, p.y);    
            }
            else {
                this.removeCell(p.x, p.y);
            }
        }
    }    
    this.game.changedCells = [];
    this.stage.update();    
}

GameRunner.prototype.addCell = function(x, y) {
    this.stage.addChild(this.drawCell(x, y, "#000000"));   
}

GameRunner.prototype.removeCell = function(x, y) {
    this.stage.addChild(this.drawCell(x, y, "#ffffff"));    
}

GameRunner.prototype.drawCell = function(x, y, color) {
    var cell = new this.renderer.Shape();
    var cellWidth = this.game.config.cellWidth;
    var cellHeight = this.game.config.cellHeight;
    cell.graphics.beginFill(color).drawRect((x - 2) * cellWidth, (y - 2) * cellHeight, cellWidth, cellHeight);
    return cell;    
}

exports.GameRunner = GameRunner;