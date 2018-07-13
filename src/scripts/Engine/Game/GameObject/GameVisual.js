import {
    GeneralProcess
} from "../../Core/GeneralProcess";
import {
    EventSystem
} from "../../Common/EventSystem";
import {
    GameNode
} from "../GameNode/GameNode";

/** 
 * Represents a visual object
 */
class GameVisual extends GameNode {
    constructor() {
        super();

        this.$start = new GeneralProcess(this).next(this.start);
        this.$update = new GeneralProcess(this).next(this.update);
        this.$dispose = new GeneralProcess(this).next(this.dispose);

        this.$gui = new GeneralProcess(this).next(this.gui);
        this.$render = new GeneralProcess(this).next(this.render);

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