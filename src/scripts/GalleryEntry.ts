import { GalleryStarter } from "./Gallery/GalleryStarter";

var container = document.getElementById("canvas-container");
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
var rebuildButton = document.getElementById("button-rebuild");
var frame = document.getElementById("text-frame");
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
    canvas.width = window.document.body.clientWidth;
    canvas.height = window.document.body.clientHeight;
    box = new GalleryStarter().launch(container, canvas);
    box.frameManager.onRateChanged = rate => {
        if (frame) { frame.innerText = "FPS:" + rate; }
    };
    box.run();
};
