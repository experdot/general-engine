import { App } from "../../../Engine/Application/AppObject/App";
import { GameBox } from "../../../Engine/Game/GameBox/GameBox";
import { GalleryCollection } from "../../Collection/GalleryCollection";
import { Utilities } from "../../../Engine/Utilities/Utilities";
import { GalleryNavigatorIds } from "../Navigator/GalleryNavigator";

const enum GalleryGameContainerIds {
    Container = "gallery-game-container",
    Canvas = "gallery-game-canvas"
}

export class GalleryGame extends App {
    box: GameBox;
    collection: GalleryCollection;

    constructor(collection: GalleryCollection) {
        super();

        this.collection = collection;
        this.joint(new GameFrameTooltip());
        this.joint(new RestartGameWhenResize());
    }

    load() {
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
        const container = $(`#${GalleryGameContainerIds.Container}`)[0] as HTMLCanvasElement

        if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        this.box = this.createGameBox(container, canvas);
        this.box.start();
    }

    private createGameBox(container: HTMLElement, canvas: HTMLCanvasElement) {
        const request = Utilities.getSearchKeyValuePair();
        const worldInfo = this.collection.infos[request["scene"]];
        if (worldInfo) {
            document.title = worldInfo.title || "<Blank>";
            return new GameBox(container, canvas, new worldInfo.symbol(canvas.width, canvas.height));
        } else {
            window.location.assign("../");
        }
    }
}

class RestartGameWhenResize extends App {
    load(source: GalleryGame) {
        window.addEventListener("resize", () => {
            this.restart(source);
        });
    }

    private restart(source: GalleryGame) {
        const canvas = $(`#${GalleryGameContainerIds.Canvas}`)[0] as HTMLCanvasElement;
        const container = $(`#${GalleryGameContainerIds.Container}`)[0] as HTMLCanvasElement

        if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
            source.box.stop();
            source.start();
        }
    }
}

class GameFrameTooltip extends App {
    start(source: GalleryGame) {
        const frameText = $(`#${GalleryNavigatorIds.FrameText}`);
        source.box.frameManager.onRateChanged = (rate: number) => {
            frameText.text(rate);
        };
    }
}