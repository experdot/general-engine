import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";

class VisualKeyBoard extends GameVisual {
    constructor() {
        super();
        this.pointers = [];
        this.cache = {};
    }

    start(source) {
        this.cache.container = source.world.ui.container;
        this.cache.cursor = this.cache.container.style.cursor;
        this.cache.container.style.cursor = "none";
        this.cache.divs = [];
    }

    update() {

    }

    dispose() {
        super.dispose();
        this.cache.divs.forEach(element => {
            element.remove();
        });
    }
}

export {
    VisualKeyBoard
};