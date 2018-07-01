import {
    GeneralTask
} from "./GeneralTask";

class GeneralProcess {
    static find(object) {
        let result = [];
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const value = object[key];
                if (value instanceof GeneralProcess) {
                    result.push({
                        key,
                        value
                    });
                }
            }
        }
        return result;
    }

    constructor(source) {
        this.source = source;
        this.tasks = [];
    }

    setSource(source) {
        this.source = source;
    }

    process() {
        this.tasks.forEach(element => {
            element.enabled && element.action && element.action.call(this.source, this.source, ...arguments);
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