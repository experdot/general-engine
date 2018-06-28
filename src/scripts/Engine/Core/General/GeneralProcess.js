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
        if (actionOrActions instanceof Array) {
            let newIndex = index;
            actionOrActions.forEach(element => {
                this.next(element, newIndex);
                newIndex++;
            });
            return this;
        }
        if (index < 0) {
            index = this.tasks.length;
        }
        this.tasks.splice(index, 0, new GeneralTask(actionOrActions));
        return this;
    }
}
export {
    GeneralProcess
};