import {
    GeneralTask
} from "./GeneralTask";

class GeneralProcess {
    constructor(context) {
        this.context = context;
        this.tasks = [];
    }

    process() {
        this.tasks.forEach(element => {
            element.enabled && element.action && element.action.call(this.context, ...arguments);
        });
    }
    before(action) {
        this.tasks.unshift(new GeneralTask(action));
        return this;
    }
    next(action, index = -1) {
        if (index < 0) {
            index = this.tasks.length;
        }
        this.tasks.splice(index, 0, new GeneralTask(action));
        return this;
    }
}
export {
    GeneralProcess
};