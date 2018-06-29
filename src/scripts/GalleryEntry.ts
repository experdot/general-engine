import { GameStarter } from "./Gallery/GameStarter/GameStarter";
import * as General from "./Engine/_General";

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

console.log(General);

function startGame(): void {
    (canvas as HTMLCanvasElement).width = document.body.clientWidth;
    (canvas as HTMLCanvasElement).height = document.body.clientHeight;
    box = new GameStarter().launch(canvas);
    box.run();
};
