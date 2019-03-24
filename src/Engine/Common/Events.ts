import { InvalidOperationException } from "./Exception";

/**
 * Represents an event system
 */
export class Events {
    private handlers: { [propertyName: string]: Function[] };

    constructor() {
        this.handlers = {};
    }

    addHandler(eventName: string, handler: Function) {
        this.registEvent(eventName);
        if (this.handlers[eventName]) {
            this.handlers[eventName].push(handler);
        } else {
            throw new InvalidOperationException("The event is not registed.");
        }
        return this;
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
        return this;
    }

    registEvent(eventName: string) {
        if (!this.handlers[eventName]) {
            this.handlers[eventName] = [];
        }
        return this;
    }

    raiseEvent(eventName: string, ...args: any[]) {
        if (this.handlers[eventName]) {
            this.handlers[eventName].forEach((action: Function) => {
                action && action(...args);
            });
        }
    }

    dispose() {
        this.handlers = {};
    }
}
