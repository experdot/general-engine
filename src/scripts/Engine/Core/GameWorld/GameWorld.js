import {
    GameVisual
} from "../GameObject/GameVisual";
import {
    Inputs
} from "../Fundamental/Inputs";

class GameWorld extends GameVisual {
    constructor(width, height) {
        super();
        // set size
        this.width = width;
        this.height = height;
        // game visual objects
        this.gameVisuals = [];
        // game input
        this.inputs = new Inputs(this);
        // initialize
        this.initialize();
        this.createObjects();

        this.start.next(this.startGameVisuals);
        this.update.next(this.updateGameVisuals);
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
    addVisual(visual) {
        this.gameVisuals.push(visual);
        visual.world = this;
    }

    raiseSelfAndGameVisualsEvent(eventName, event) {
        this.eventSystem.raiseEvent(eventName, event);
        this.gameVisuals.forEach(element => {
            element.eventSystem.raiseEvent(eventName, event);
        });
    }
}

export {
    GameWorld
};