import { GameStarter } from "./Gallery/GameStarter/GameStarter";

var canvas = document.getElementById("canvas");
var rebuildButton = document.getElementById("button-rebuild");
var box;

window.addEventListener("resize", function () {
    box.stop();
    startGame();
});
rebuildButton.addEventListener("click", function () {
    box.stop();
    startGame();
})

startGame();

function startGame(): void {
    (canvas as HTMLCanvasElement).width = document.body.clientWidth;
    (canvas as HTMLCanvasElement).height = document.body.clientHeight;
    box = new GameStarter().launch(canvas);
    box.run();
};
