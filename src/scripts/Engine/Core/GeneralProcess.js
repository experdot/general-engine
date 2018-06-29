import {
    GeneralTask
} from "./GeneralTask";

class GeneralProcess {
    constructor(context) {
        this.context = context;
        this.tasks = [];
    }

    setContext(context) {
        this.context = context;
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
    next(actionOrActions, index = -1) {
        if (index < 0) {
            index = this.tasks.length;
        }
        if (actionOrActions instanceof Array) {
            this.tasks.splice(index, 0, ...actionOrActions.map(action => new GeneralTask(action)));
        } else {
            this.tasks.splice(index, 0, new GeneralTask(actionOrActions));
        }
        return this;
    }
}
export {
    GeneralProcess
};