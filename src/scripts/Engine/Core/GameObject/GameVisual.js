import {
    Transform
} from "../Fundamental/Property";
import {
    EventSystem
} from "../Fundamental/EventSystem";
import {
    GeneralObject
} from "../General/GeneralObject";

/** 
 * Represents a visual object
 */
class GameVisual extends GeneralObject {
    constructor(view) {
        super();
        this.transform = new Transform();
        this.world = null;
        this.bindView(view);
        this.eventSystem = new EventSystem();
    }

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