import { InvalidOperationException } from "./Exception";

export enum StrictMode {
    None,
    Strict
}

/**
 * Represents an event system
 */
export class Events {

    public readonly mode: StrictMode;

    private handlers: {};
    private dom0Events: any[];
    private dom2Events: any[];


    constructor(mode = StrictMode.None) {
        this.mode = mode;
        this.handlers = {};
        this.dom0Events = [];
        this.dom2Events = [];
    }

    addHandler(eventName, handler, force = false) {
        if (this.mode === StrictMode.None || force) {
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

    registEventDomLevel0(eventTarget, eventName, domEventName) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
            if (domEventName && eventTarget) {
                eventTarget[domEventName] = (event) => {
                    this.raiseEvent(eventName, event);
                };
                this.dom0Events.push({
                    ui: eventTarget,
                    name: domEventName
                });
            }
        }
    }

    registEventDomLevel2(eventTarget, eventName, domEventName, useCapture) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
            if (domEventName && eventTarget) {
                let listener = (event) => {
                    this.raiseEvent(eventName, event);
                };
                eventTarget.addEventListener(domEventName, listener, useCapture);
                this.dom2Events.push({
                    ui: eventTarget,
                    name: domEventName,
                    listener: listener
                });
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

    release() {
        this.handlers = {};
        this.dom0Events.forEach(event => {
            event.ui[event.name] = null;
        });
        this.dom2Events.forEach(event => {
            event.ui.removeEventListener(event.name, event.listener);
        });
    }
}
