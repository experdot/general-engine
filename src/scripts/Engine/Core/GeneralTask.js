class GeneralTask {
    constructor(action, name = "", enabled = true) {
        this.action = action;
        this.name = name;
        this.enabled = enabled;
    }

    run(thisArg, ...args) {
        this.enabled && this.action && this.action.call(thisArg, ...args);
    }
}

export {
    GeneralTask
};