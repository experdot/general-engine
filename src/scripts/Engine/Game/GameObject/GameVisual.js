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
    constructor(view) {
        super();

        this.start = new GeneralProcess(this);
        this.update = new GeneralProcess(this);
        this.dispose = new GeneralProcess(this);

        this.transform = new Transform();
        this.eventSystem = new EventSystem();
        this.bindView(view);
    }

    bindView(view) {
        this.view = view;
        if (view) {
            view.target = this;
        }
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