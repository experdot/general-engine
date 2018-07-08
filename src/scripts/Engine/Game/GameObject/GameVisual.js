import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    GeneralProcess
} from "../../Core/GeneralProcess";
import {
    EventSystem
} from "../../Common/EventSystem";

/** 
 * Represents a visual object
 */
class GameVisual extends GeneralObject {
    constructor() {
        super();

        this.$start = new GeneralProcess(this).next(this.start);
        this.$update = new GeneralProcess(this).next(this.update);
        this.$dispose = new GeneralProcess(this).next(this.dispose);

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

    dispose() {
        this.eventSystem.release();
    }
}

export {
    GameVisual
};