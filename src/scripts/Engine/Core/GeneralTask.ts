export class GeneralTask {
    action: Function;
    identifier: number;
    enabled: boolean;

    constructor(action: Function, identifier = Number.MIN_SAFE_INTEGER, enabled = true) {
        this.action = action;
        this.identifier = identifier;
        this.enabled = enabled;
    }

    run(thisArg: object, ...args: any[]) {
        this.enabled && this.action && this.action.call(thisArg, ...args);
    }
}
