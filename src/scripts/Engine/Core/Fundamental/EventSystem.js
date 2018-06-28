import {
    Exception
} from "./Exception";


const StrictMode = {
    None: 0,
    Strict: 1 // The event must be registed explicitly
};

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
            throw new Exception("The event is not registed.");
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

/**
 * Represents the base class for classes that contain event data, 
 * and provides a value to use for events that do not include event data.
 */
class EventArgs {
    constructor() {

    }

    static get empty() {
        return new EventArgs();
    }
}

class ValueChangedEventArgs extends EventArgs {
    constructor(source, newValue) {
        super();
        this.source = source;
        this.newValue = newValue;
    }
}

export {
    StrictMode,
    EventSystem,
    EventArgs,
    ValueChangedEventArgs
};