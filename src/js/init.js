var game;
var gameRunner;

function init() {
	var gameConfig = {
        canvasWidth: 800,
        canvasHeight: 600,
        cellWidth: 10,
        cellHeight: 10
    };

    game = new Game(gameConfig);

    var gameRunnerConfig = {
		game: game,
		renderer: createjs,
		canvasId: "myCanvas",
		refreshInterval: 100,
		paused: true,
		viewPaddingX: 40,
		viewPaddingY: 40
	};

	gameRunner = new GameRunner(gameRunnerConfig);
	gameRunner.init();
}