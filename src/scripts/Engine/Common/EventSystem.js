import {
    InvalidOperationException
} from "./Exception";
import {
    Enum
} from "./Enum";


const StrictMode = Enum.create({
    None: 0,
    Strict: 1 // The event must be registed explicitly
});

/**
 * Represents a event container
 */
class EventSystem {
    constructor(mode = StrictMode.None) {
        this.mode = mode;
        this.handlers = {};
    }

    addHandler(eventName, handler, force = false) {
        if (this.strict === StrictMode.None || force) {
            this.registEvent(eventName);
        }
        if (this.handlers[eventName]) {
            this.handlers[eventName].push(handler);
        } else {
            throw new InvalidOperationException("The event is not registed.");
        }
        return handler;
    }

    removeHandler(eventName, handler) {
        let handlers = this.handlers[eventName];
        if (handlers && handlers.length > 0) {
            let index = handlers.findIndex((value) => {
                return value === handler;
            });
            if (index >= 0) {
                handlers.splice(index, 1);
            }
        }
    }

    registEvent(eventName) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
    }

    registSystemEventByDom0(eventTarget, eventName, domEventName) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
            if (domEventName && eventTarget) {
                eventTarget[domEventName] = (event) => {
                    this.raiseEvent(eventName, event);
                };
            }
        }
    }

    registSystemEventByDom2(eventTarget, eventName, domEventName, useCapture) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
            if (domEventName && eventTarget) {
                eventTarget.addEventListener(domEventName, (event) => {
                    this.raiseEvent(eventName, event);
                }, useCapture);
            }
        }
    }

    raiseEvent(eventName, args) {
        if (this.handlers[eventName]) {
            this.handlers[eventName].forEach(element => {
                element(args);
            });
        }
    }
}



export {
    StrictMode,
    EventSystem
};