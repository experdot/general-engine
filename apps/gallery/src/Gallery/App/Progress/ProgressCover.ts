import { App } from "@legacy/Engine/Application/AppObject/App";
import { byId } from "../../../dom";

const enum ContainerIds {
    ProgressCover = "gallery-game-layer-progress"
}

export class ProgressCover extends App {
    start() {
        setTimeout(() => {
            const layer = byId<HTMLDivElement>(ContainerIds.ProgressCover);
            layer.classList.remove("show");
            setTimeout(() => {
                layer.remove();
            }, 150);
        }, 850);
    }
}
