class GeneralTask {
    constructor(action, name = "", enabled = true) {
        this.action = action;
        this.name = name;
        this.enabled = enabled;
    }
}

export {
    GeneralTask
};