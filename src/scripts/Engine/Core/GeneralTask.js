class GeneralTask {
    constructor(action, name = "", enabled = true) {
        this.action = action;
        this.name = name;
        this.enabled = enabled;
    }

    run(source, ...args) {
        this.enabled && this.action && this.action.call(source, ...args);
    }
}

export {
    GeneralTask
};