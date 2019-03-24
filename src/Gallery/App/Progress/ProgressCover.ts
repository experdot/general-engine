import { App } from "../../../Engine/Application/AppObject/App";

const enum ContainerIds {
    ProgressCover = "gallery-game-layer-progress"
}

export class ProgressCover extends App {
    start() {
        setTimeout(() => {
            const layer = $(`#${ContainerIds.ProgressCover}`);
            layer.removeClass("show");
            setTimeout(() => {
                layer.remove();
            }, 150);
        }, 850);
    }
}