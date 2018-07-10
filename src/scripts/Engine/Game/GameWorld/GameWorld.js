import {
    Inputs
} from "../../Common/Inputs";
import {
    GameVisual
} from "../GameObject/GameVisual";
import {
    GameView
} from "../GameObject/GameView";

class GameWorld extends GameVisual {
    get size() {
        return {
            width: this.width,
            height: this.height,
            center: {
                x: this.width / 2,
                y: this.height / 2,
            }
        };
    }

    constructor(width, height) {
        super();

        this.width = width;
        this.height = height;

        this.world = this;
        this.visuals = [];

        this.inputs = new Inputs().change((eventName, event) => this.dispatch(eventName, event));

        this.initialize();
        this.createObjects();
    }

    initialize() {}

    createObjects() {}

    initializeUI(ui) {
        this.ui = ui;
        this.inputs.launch(this.ui);
    }

    addChild(visual, view = new GameView()) {
        super.addChild(visual);
        visual.world = this;
        visual.proxy(view);
    }

    dispose() {
        super.dispose();
        this.inputs.release();
    }
}

export {
    GameWorld
};