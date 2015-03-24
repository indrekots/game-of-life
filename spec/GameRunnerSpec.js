var gameRunnerObj = require('../src/js/GameRunner.js');
var gameObj = require('../src/js/Game.js');

describe("When GameRunner is created", function() {
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
		gameRunnerConfig = {
    		game: game,
    		renderer: renderer
    	};
    	gameRunner = new gameRunnerObj.GameRunner(gameRunnerConfig);
    });

	it("should have an instance of a game defined", function() {
		expect(gameRunner.game).toBeDefined();
	});

	it("should have an instance of a renderer defined", function() {
		expect(gameRunner.renderer).toBeDefined();
	});

	it("can be initialized", function() {
		gameRunner.renderer.Stage = jasmine.createSpy("Stage() spy")
										.andReturn(jasmine.createSpyObj("stage", ["on"]));
		gameRunner.renderer.Ticker = jasmine.createSpyObj("Ticker", ["interval", "paused", "addEventListener"]);
		gameRunner.init();
		expect(gameRunner.renderer.Stage).toHaveBeenCalledWith("myCanvas");
		expect(gameRunner.stage.on).toHaveBeenCalled();
		expect(gameRunner.renderer.Ticker.interval).toEqual(1000);
		expect(gameRunner.renderer.Ticker.paused).toBe(true);
		expect(gameRunner.renderer.Ticker.addEventListener).toHaveBeenCalled();
	});

	it("screen can be refreshed", function() {
		gameRunner.stage = jasmine.createSpyObj("stage", ["update"]);
		gameRunner.refresh();
		expect(gameRunner.stage.update).toHaveBeenCalled();
	});

	it("cell can be added", function() {
		var cell = jasmine.createSpyObj("cell", ["graphics"]);
		cell.graphics.beginFill = jasmine.createSpy("beginFill() spy").andReturn(cell.graphics);
		cell.graphics.drawRect = jasmine.createSpy("drawRect() spy"); 
		gameRunner.renderer.Shape = jasmine.createSpy("Shape() spy")
										.andReturn(cell);
		gameRunner.stage = jasmine.createSpyObj("stage", ["addChild"]);
		gameRunner.addCell();
		expect(gameRunner.stage.addChild).toHaveBeenCalled();
	});

	it("cell can be removed", function() {
		gameRunner.stage = jasmine.createSpyObj("stage", ["addChild"]);
		gameRunner.removeCell();
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
