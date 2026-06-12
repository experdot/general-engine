import { App } from "@legacy/Engine/Application/AppObject/App";
import { GameBox } from "@legacy/Engine/Game/GameBox/GameBox";
import { GalleryCollection } from "../../Collection/GalleryCollection";
import { Utilities } from "@legacy/Engine/Utilities/Utilities";
import { GalleryNavigatorIds } from "../Navigator/GalleryNavigator";
import { byId, setText } from "../../../dom";

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
        byId<HTMLButtonElement>(GalleryNavigatorIds.ButtonRestart).addEventListener("click", () => {
            this.box.stop();
            this.start();
        });

        byId<HTMLButtonElement>(GalleryNavigatorIds.ButtonFullscreen).addEventListener("click", () => {
            Utilities.requestFullScreen(true, byId<HTMLElement>(GalleryGameContainerIds.Container));
        });
    }

    start() {
        const canvas = byId<HTMLCanvasElement>(GalleryGameContainerIds.Canvas);
        const container = byId<HTMLDivElement>(GalleryGameContainerIds.Container);

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
        const canvas = byId<HTMLCanvasElement>(GalleryGameContainerIds.Canvas);
        const container = byId<HTMLDivElement>(GalleryGameContainerIds.Container);

        if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
            source.box.stop();
            source.start();
        }
    }
}

class GameFrameTooltip extends App {
    start(source: GalleryGame) {
        source.box.frameManager.onRateChanged = (rate: number) => {
            setText(GalleryNavigatorIds.FrameText, String(rate));
        };
    }
}
