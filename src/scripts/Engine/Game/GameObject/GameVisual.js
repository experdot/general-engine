import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    GeneralProcess
} from "../../Core/GeneralProcess";
import {
    EventSystem
} from "../../Common/EventSystem";
import {
    ArgumentException
} from "../../Common/Exception";

/** 
 * Represents a visual object
 */
class GameVisual extends GeneralObject {
    constructor() {
        super();

        this.$start = new GeneralProcess(this).next(this.start);
        this.$update = new GeneralProcess(this).next(this.update);
        this.$render = new GeneralProcess(this).next(this.draw);
        this.$dispose = new GeneralProcess(this).next(this.dispose);

        this.children = [];

        this.eventSystem = new EventSystem();
    }

    addChild(child) {
        if (child instanceof GameVisual) {
            this.proxy(child);
            this.children.push(child);
        } else {
            throw ArgumentException("The child must be an instance of GameVisual.");
        }
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