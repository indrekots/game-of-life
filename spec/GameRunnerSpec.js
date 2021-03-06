var gameRunnerObj = require('../src/js/GameRunner.js');
var gameObj = require('../src/js/Game.js');

describe("GameRunner", function() {
	var game;
	var renderer = {};
	var gameConfig = {
        canvasWidth: 800,
        canvasHeight: 600,
        cellWidth: 10,
        cellHeight: 10
    };
	var gameRunner;
	var gameRunnerConfig;

	beforeEach(function() {
    	game = new gameObj.Game(gameConfig);
    	spyOn(game, 'nextGeneration').andCallThrough();
    	spyOn(game, 'translateCoordinates').andCallThrough();
    	spyOn(game, 'toggleCell').andCallThrough();
		gameRunnerConfig = {
    		game: game,
    		renderer: renderer,
    		canvasId: "canvasId",
    		refreshInterval: 100,
    		paused: true,
    		viewPaddingX: 40,
    		viewPaddingY: 40
    	};
    	buildGameRunner();
    	gameRunner.init();
    });

    function buildGameRunner() {
    	gameRunner = new gameRunnerObj.GameRunner(gameRunnerConfig);
    	gameRunner.renderer.Stage = jasmine.createSpy("Stage() spy")
    		.andReturn(jasmine.createSpyObj("stage", ["on", "update", "addChild"]));
		gameRunner.renderer.Ticker = jasmine.createSpyObj("Ticker", 
			["interval", "paused", "addEventListener"]);
		spyOn(gameRunner, 'refresh').andCallThrough();
		spyOn(gameRunner, 'drawCell').andCallThrough();
		spyOn(gameRunner, 'addCell').andCallThrough();
		spyOn(gameRunner, 'removeCell').andCallThrough();
		mockGameRunnerGraphics();
    }

    function mockGameRunnerGraphics() {
    	var cell = jasmine.createSpyObj("cell", ["graphics"]);
		cell.graphics.beginFill = jasmine.createSpy("beginFill() spy").andReturn(cell.graphics);
		cell.graphics.drawRect = jasmine.createSpy("drawRect() spy"); 
		gameRunner.renderer.Shape = jasmine.createSpy("Shape() spy").andReturn(cell);
    }

	it("should have an instance of a game defined", function() {
		expect(gameRunner.game).toBeDefined();
	});

	it("should have an instance of a renderer defined", function() {
		expect(gameRunner.renderer).toBeDefined();
	});

	it("can be initialized", function() {
		expect(gameRunner.renderer.Stage).toHaveBeenCalledWith(gameRunner.config.canvasId);
		expect(gameRunner.stage.on).toHaveBeenCalledWith("stagemouseup", jasmine.any(Function));
		expect(gameRunner.stage.on).toHaveBeenCalledWith("stagemousedown", jasmine.any(Function));
		expect(gameRunner.stage.on).toHaveBeenCalledWith("stagemousemove", jasmine.any(Function));
		expect(gameRunner.renderer.Ticker.interval).toEqual(gameRunner.config.refreshInterval);
		expect(gameRunner.renderer.Ticker.paused).toBe(gameRunner.config.paused);
		expect(gameRunner.renderer.Ticker.addEventListener)
			.toHaveBeenCalledWith("tick", jasmine.any(Function));
	});
	
	it("game should be refreshed when mouse is released", function()  {
		var args = gameRunner.stage.on.argsForCall;
		args[0][1].call(gameRunner, {stageX: 20, stageY: 34});
		expect(gameRunner.refresh).toHaveBeenCalled();
		expect(gameRunner.game.board[6][7]).toEqual(1);
		expect(gameRunner.mousePressed).toBe(false);
	});

	it("mouse coords should be translated to board coords when mouse moves", function()  {
		var args = gameRunner.stage.on.argsForCall;
		args[2][1].call(gameRunner, {stageX: 80, stageY: 56});
		expect(gameRunner.game.translateCoordinates).toHaveBeenCalledWith(80, 56);
	});

	it("game board should be refreshed when mouse is pressed and mouse moves to a new cell", function() {
		gameRunner.mousePressed = true;
		gameRunner.mousePressedAt = {x: 34, y: 38};
		var args = gameRunner.stage.on.argsForCall;
		args[2][1].call(gameRunner, {stageX: 344, stageY: 378});
		expect(gameRunner.mousePressedAt).toEqual({x: 34, y: 37});
		expect(gameRunner.game.toggleCell).toHaveBeenCalledWith(384, 418);
		expect(gameRunner.refresh).toHaveBeenCalled();
	});

	it("game board should not be refreshed when mouse is pressed and does not move to a new cell", function() {
		gameRunner.mousePressed = true;
		gameRunner.mousePressedAt = {x: 34, y: 38};
		var args = gameRunner.stage.on.argsForCall;
		args[2][1].call(gameRunner, {stageX: 345, stageY: 386});
		expect(gameRunner.mousePressedAt).toEqual({x: 34, y: 38});
		expect(gameRunner.game.toggleCell).not.toHaveBeenCalledWith();
		expect(gameRunner.refresh).not.toHaveBeenCalled();
	});

	it("clicked state should be true when mouse is left clicked", function() {
		var args = gameRunner.stage.on.argsForCall;
		args[1][1].call(gameRunner, {stageX: 733, stageY: 245});
		expect(gameRunner.mousePressed).toBe(true);
		expect(gameRunner.mousePressedAt).toEqual({x: 73, y: 24});
	});

	it("when tick event happens and ticker is not paused, game should be refreshed", function() {
		var args = gameRunner.renderer.Ticker.addEventListener.argsForCall;
		args[0][1].call(gameRunner, {paused: false});
		expect(gameRunner.game.nextGeneration).toHaveBeenCalled();
		expect(gameRunner.refresh).toHaveBeenCalled();
	});

	it("when tick event happens and ticker is paused, game should not be refreshed", function() {
		var args = gameRunner.renderer.Ticker.addEventListener.argsForCall;
		args[0][1].call(gameRunner, {paused: true});
		expect(gameRunner.game.nextGeneration).not.toHaveBeenCalled();
		expect(gameRunner.refresh).not.toHaveBeenCalled();
	});
	
	it("when screen is refreshed and cell has been added, new cell should be drawn", function() {
		game.board[2][5] = 1;
		game.changedCells.push({x: 2, y: 5});
		gameRunner.refresh();
		expect(gameRunner.addCell).toHaveBeenCalledWith(2, 5);
		expect(gameRunner.stage.update).toHaveBeenCalled();
	});

	it("when screen is refreshed and cell has been deleted, cell should be removed", function() {
		game.changedCells.push({x: 4, y: 7});
		gameRunner.refresh();
		expect(gameRunner.removeCell).toHaveBeenCalledWith(4, 7);
		expect(gameRunner.stage.update).toHaveBeenCalled();
	});

	it("when screen is refreshed and deleted cell is out of screen view, nothing should be redrawn", function() {
		game.changedCells.push({x: 1, y: 7});
		gameRunner.refresh();
		expect(gameRunner.removeCell).not.toHaveBeenCalled();
		expect(gameRunner.stage.update).toHaveBeenCalled();
	});

	it("when screen is refreshed and added cell is out of screen view, nothing should be redrawn", function() {
		game.board[4][79] = 1;
		game.changedCells.push({x: 4, y: 79});
		gameRunner.refresh();
		expect(gameRunner.addCell).not.toHaveBeenCalled();
		expect(gameRunner.stage.update).toHaveBeenCalled();
	});

	it("when adding a cell, a black rectangle is created", function() {
		gameRunner.addCell(3, 6);
		expect(gameRunner.drawCell).toHaveBeenCalledWith(3, 6, "#000000");
		expect(gameRunner.stage.addChild).toHaveBeenCalled();
	});

	it("when removing a cell, a black rectangle is redrawn with a white one", function() {
		gameRunner.removeCell(5, 8);
		expect(gameRunner.drawCell).toHaveBeenCalledWith(5, 8, "#ffffff");
		expect(gameRunner.stage.addChild).toHaveBeenCalled();	
	});
});

describe("When GameRunner is created without config", function() {
	it("should throw an error", function() {
		expect(function() {new gameRunnerObj.GameRunner()})
            .toThrow(new Error("No config provided!"));
	});
});

describe("When GameRunner is created with faulty config", function() {
	it("should throw an error when instance of a game is not provided", function() {
		var config = {};
		expect(function() {new gameRunnerObj.GameRunner(config)})
            .toThrow(new Error("Instance of a game not provided"));
	});

	it("should throw an error when instance of a renderer is not provided", function() {
		var config = {game: {}};
		expect(function() {new gameRunnerObj.GameRunner(config)})
            .toThrow(new Error("Instance of a renderer not provided"));
	});
});
