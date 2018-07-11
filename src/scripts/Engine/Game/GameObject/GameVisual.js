import {
    GeneralNode
} from "../../Core/GeneralNode";
import {
    GeneralProcess
} from "../../Core/GeneralProcess";
import {
    EventSystem
} from "../../Common/EventSystem";

/** 
 * Represents a visual object
 */
class GameVisual extends GeneralNode {
    constructor() {
        super();

        this.$start = new GeneralProcess(this).next(this.start);
        this.$update = new GeneralProcess(this).next(this.update);
        this.$render = new GeneralProcess(this).next(this.draw);
        this.$dispose = new GeneralProcess(this).next(this.dispose);

        this.eventSystem = new EventSystem();
    }

    on(eventName, handler, force = true) {
        this.eventSystem.addHandler(eventName, handler, force);
    }

    off(eventName, handler) {
        this.eventSystem.removeHandler(eventName, handler);
    }

    dispatch(eventName, event) {
        this.eventSystem.raiseEvent(eventName, event);
        this.children.forEach(element => {
            element.dispatch(eventName, event);
        });
    }

    dispose() {
        this.eventSystem.release();
    }
}

export {
    GameVisual
};