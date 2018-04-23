import {
    Transform
} from "../Fundamental/Property";
import {
    EventSystem
} from "../Fundamental/EventSystem";
import {
    FlowProcess
} from "../Fundamental/FlowProcess";

/** 
 * Represents a visual object
 */
class GameVisual {
    constructor(view) {
        this.transform = new Transform();
        this.world = null;
        this.bindView(view);
        this.eventSystem = new EventSystem();

        this.startProcess = new FlowProcess(this);
        this.updateProcess = new FlowProcess(this);
    }
    // invoke when a visual object is added to the world.
    start() {
        this.startProcess.process();
    }
    // invoke once per frame.
    update() {
        this.updateProcess.process();
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