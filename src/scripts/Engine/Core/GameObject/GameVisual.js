import {
    Transform
} from "../Fundamental/Property";
import {
    EventSystem
} from "../Fundamental/EventSystem";

/** 
 * Represents a visual object
 */
class GameVisual {
    constructor(view) {
        this.transform = new Transform();
        this.world = null;
        this.bindView(view);
        this.eventSystem = new EventSystem();
    }
    // invoke when a visual object is added to the world.
    start() {}
    // invoke every frame.
    update() {}

    bindView(view) {
        this.view = view;
        if (view) {
            view.target = this;
        }
    }
}

export {
    GameVisual
};