class GeneralTask {
    public action: { (): any };
    public identifier: number;
    public enabled: boolean;

    constructor(action, identifier = Number.MIN_SAFE_INTEGER, enabled = true) {
        this.action = action;
        this.identifier = identifier;
        this.enabled = enabled;
    }

    run(thisArg: object, ...args) {
        this.enabled && this.action && this.action.call(thisArg, ...args);
    }
}

export {
    GeneralTask
};