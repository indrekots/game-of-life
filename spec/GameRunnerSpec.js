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
		gameRunnerConfig = {
    		game: game,
    		renderer: renderer,
    		canvasId: "canvasId",
    		refreshInterval: 100,
    		paused: true
    	};
    	buildGameRunner();
    });

    function buildGameRunner() {
    	gameRunner = new gameRunnerObj.GameRunner(gameRunnerConfig);
    	gameRunner.renderer.Stage = jasmine.createSpy("Stage() spy")
    		.andReturn(jasmine.createSpyObj("stage", ["on", "update", "addChild"]));
		gameRunner.renderer.Ticker = jasmine.createSpyObj("Ticker", 
			["interval", "paused", "addEventListener"]);
		spyOn(gameRunner, 'refresh').andCallThrough();
		spyOn(gameRunner, 'drawCell').andCallThrough();
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
		gameRunner.init();
		expect(gameRunner.renderer.Stage).toHaveBeenCalledWith(gameRunner.config.canvasId);
		expect(gameRunner.stage.on).toHaveBeenCalledWith("stagemousedown", jasmine.any(Function));
		expect(gameRunner.renderer.Ticker.interval).toEqual(gameRunner.config.refreshInterval);
		expect(gameRunner.renderer.Ticker.paused).toBe(gameRunner.config.paused);
		expect(gameRunner.renderer.Ticker.addEventListener)
			.toHaveBeenCalledWith("tick", jasmine.any(Function));
	});

	it("when mouse is clicked, game should be refreshed", function()  {
		gameRunner.init();
		var args = gameRunner.stage.on.argsForCall;
		args[0][1].call(gameRunner, {stageX: 20, stageY: 34});
		expect(gameRunner.refresh).toHaveBeenCalled();
		expect(gameRunner.game.board[4][5]).toEqual(1);
	});

	it("when tick event happens and ticker is not paused, game should be refreshed", function() {
		gameRunner.init();
		var args = gameRunner.renderer.Ticker.addEventListener.argsForCall;
		args[0][1].call(gameRunner, {paused: false});
		expect(gameRunner.game.nextGeneration).toHaveBeenCalled();
		expect(gameRunner.refresh).toHaveBeenCalled();
	});

	it("when tick event happens and ticker is paused, game should not be refreshed", function() {
		gameRunner.init();
		var args = gameRunner.renderer.Ticker.addEventListener.argsForCall;
		args[0][1].call(gameRunner, {paused: true});
		expect(gameRunner.game.nextGeneration).not.toHaveBeenCalled();
		expect(gameRunner.refresh).not.toHaveBeenCalled();
	});
	
	it("screen can be refreshed", function() {
		gameRunner.init();
		gameRunner.refresh();
		expect(gameRunner.stage.update).toHaveBeenCalled();
	});

	it("when adding a cell, a black rectangle is created", function() {
		gameRunner.init();
		gameRunner.addCell(3, 6);
		expect(gameRunner.drawCell).toHaveBeenCalledWith(3, 6, "#000000");
		expect(gameRunner.stage.addChild).toHaveBeenCalled();
	});

	it("when removing a cell, a black rectangle is redrawn with a white one", function() {
		gameRunner.init();
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
