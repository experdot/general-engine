import {
    GameVisual
} from "../GameObject/GameVisual";
import {
    Vector2
} from "../../../Fundamental/Vector";

class GameWorld extends GameVisual {
    constructor(width, height) {
        super();
        // set size
        this.width = width;
        this.height = height;
        // game visual objects
        this.gameVisuals = [];
        this.input = {
            pointer: new Vector2(0, 0)
        };
        // initialize
        this.initialize();
        this.createObjects();
    }

    initialize() {}

    createObjects() {}

    start() {
        this.gameVisuals.forEach(element => {
            element.start();
        });
    }

    update() {
        this.gameVisuals.forEach(element => {
            element.update();
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
            if (element.eventSystem.handlers[eventName]) {
                element.eventSystem.handlers[eventName].forEach(handler => {
                    handler(event);
                });
            }
        });
    }
}

export {
    GameWorld
};