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
    constructor(width, height) {
        super();
        // set size
        this.width = width;
        this.height = height;
        // game visual objects
        this.gameVisuals = [];
        // game input
        this.inputs = new Inputs().handle((eventName, event) => this.raiseEvent(eventName, event));
        // initialize
        this.initialize();
        this.createObjects();

        this.start.next(this.startGameVisuals);
        this.update.next(this.updateGameVisuals);
        this.dispose.next(() => this.inputs.release());
    }

    initialize() {}

    initializeUI(ui) {
        this.ui = ui;
        this.inputs.launch(this.ui);
    }

    createObjects() {}

    startGameVisuals() {
        this.gameVisuals.forEach(element => {
            element.start.process();
        });
    }

    updateGameVisuals() {
        this.gameVisuals.forEach(element => {
            element.update.process();
        });
    }

    // Add a visual object into world
    addVisual(visual, view = new GameView()) {
        visual.world = this;
        visual.bind(view);
        this.gameVisuals.push(visual);
    }

    raiseEvent(eventName, event) {
        this.eventSystem.raiseEvent(eventName, event);
        this.gameVisuals.forEach(element => {
            element.eventSystem.raiseEvent(eventName, event);
        });
    }
}

export {
    GameWorld
};