import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    Transform
} from "../../Numerics/Transform";
import {
    EventSystem
} from "../../Common/EventSystem";
import {
    GeneralProcess
} from "../../Core/GeneralProcess";

/** 
 * Represents a visual object
 */
class GameVisual extends GeneralObject {
    constructor() {
        super();

        this.start = new GeneralProcess(this);
        this.update = new GeneralProcess(this);
        this.dispose = new GeneralProcess(this);

        this.transform = new Transform();
        this.eventSystem = new EventSystem();
    }

    bind(view) {
        this.view = view;
        view.target = this;
    }

    on(eventName, handler, force = true) {
        this.eventSystem.addHandler(eventName, handler, force);
    }

    off(eventName, handler) {
        this.eventSystem.removeHandler(eventName, handler);
    }
}

export {
    GameVisual
};