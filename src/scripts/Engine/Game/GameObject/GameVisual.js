import {
    Events
} from "../../Common/Events";
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
        this.events = new Events();
    }

    on(eventName, handler, force = true) {
        this.events.addHandler(eventName, handler, force);
    }

    off(eventName, handler) {
        this.events.removeHandler(eventName, handler);
    }

    dispatch(eventName, event) {
        this.events.raiseEvent(eventName, event);
        this.children.forEach(element => {
            element.dispatch(eventName, event);
        });
    }

    dispose() {
        this.events.release();
    }
}

export {
    GameVisual
};