import {
    EventSystem
} from "../../Common/EventSystem";
import {
    GeneralNode
} from "../../Core/GeneralNode";
import {
    GameVisualInterface
} from "../GameInterface/GameInterface";

/** 
 * Represents a visual object
 */
class GameVisual extends GeneralNode {
    constructor() {
        super();
        this.implements(GameVisualInterface);
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