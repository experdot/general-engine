import { InvalidOperationException } from "./Exception";

export enum StrictMode {
    None,
    Strict
}

/**
 * Represents an event system
 */
export class Events {
    readonly mode: StrictMode;

    private handlers: any;
    private dom0Events: any[];
    private dom2Events: any[];


    constructor(mode = StrictMode.None) {
        this.mode = mode;
        this.handlers = {};
        this.dom0Events = [];
        this.dom2Events = [];
    }

    addHandler(eventName: string, handler: Function, force = false) {
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

    removeHandler(eventName: string, handler: Function) {
        const handlers = this.handlers[eventName] as Function[];
        if (handlers && handlers.length > 0) {
            const index = handlers.findIndex((value) => {
                return value === handler;
            });
            if (index >= 0) {
                handlers.splice(index, 1);
            }
        }
    }

    registEvent(eventName: string) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
    }

    registEventDomLevel0(eventTarget: EventTarget, eventName: string, domEventName: string) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
            if (domEventName && eventTarget) {
                (eventTarget as any)[domEventName] = (event: Event) => {
                    this.raiseEvent(eventName, event);
                };
                this.dom0Events.push({
                    ui: eventTarget,
                    name: domEventName
                });
            }
        }
    }

    registEventDomLevel2(eventTarget: EventTarget, eventName: string, domEventName: string, useCapture: any) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
            if (domEventName && eventTarget) {
                const listener = (event: Event) => {
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

    raiseEvent(eventName: string, ...args: any[]) {
        if (this.handlers[eventName]) {
            this.handlers[eventName].forEach((element: Function) => {
                element(...args);
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
