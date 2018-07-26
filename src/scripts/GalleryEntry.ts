import { GalleryStarter } from "./Gallery/GalleryStarter";

declare const window: any

var canvas = window.document.getElementById("canvas");
var rebuildButton = window.document.getElementById("button-rebuild");
var frame = window.document.getElementById("text-frame");
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
    box = new GalleryStarter().launch(canvas);
    box.frameManager.onRateChanged = rate => {
        if (frame) { frame.innerText = "FPS:" + rate; }
    };
    box.run();
};
