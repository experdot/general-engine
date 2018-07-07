import { GalleryStarter } from "./Gallery/GalleryStarter";

var canvas = document.getElementById("canvas");
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
    (canvas as HTMLCanvasElement).width = document.body.clientWidth;
    (canvas as HTMLCanvasElement).height = document.body.clientHeight;
    box = new GalleryStarter().launch(canvas);
    box.frameManager.onRateChanged = rate => {
        if (frame) { frame.innerText = "FPS:" + rate; }
    };
    box.run();
};
