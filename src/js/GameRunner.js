var game;
var stage;
function GameRunner(config) {
    
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