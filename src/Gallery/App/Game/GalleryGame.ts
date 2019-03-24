import { App } from "../../../Engine/Application/AppObject/App";
import { GameBox } from "../../../Engine/Game/GameBox/GameBox";
import { GalleryStarter } from "../../GalleryStarter";
import { Utilities } from "../../../Engine/Utilities/Utilities";
import { GalleryNavigatorIds } from "../Navigator/GalleryNavigator";

const enum GalleryGameContainerIds {
    Container = "gallery-game-container",
    Canvas = "gallery-game-canvas"
}

export class GalleryGame extends App {
    private box: GameBox;
    private starter: GalleryStarter = new GalleryStarter();

    load() {
        window.addEventListener("resize", () => {
            this.box.stop();
            this.start();
        });

        $(`#${GalleryNavigatorIds.ButtonRestart}`).click(() => {
            this.box.stop();
            this.start();
        });

        $(`#${GalleryNavigatorIds.ButtonFullscreen}`).click(() => {
            Utilities.requestFullScreen(true, $(`#${GalleryGameContainerIds.Container}`)[0]);
        });
    }

    start() {
        const canvas = $(`#${GalleryGameContainerIds.Canvas}`)[0] as HTMLCanvasElement;
        canvas.width = window.document.body.clientWidth;
        canvas.height = window.document.body.clientHeight;

        this.box = this.starter.launch($(`#${GalleryGameContainerIds.Container}`)[0], canvas);

        const frameText = $(`#${GalleryNavigatorIds.FrameText}`);
        this.box.frameManager.onRateChanged = (rate: number) => {
            frameText.text(rate);
        };

        this.box.run();
    }
}