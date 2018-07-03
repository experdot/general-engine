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

    before(...actions) {
        this.tasks.unshift(...actions.map(action => new GeneralTask(action)));
        return this;
    }

    next(...actions) {
        this.tasks.push(...actions.map(action => new GeneralTask(action)));
        return this;
    }

    insert(index, ...actions) {
        this.tasks.splice(index, 0, ...actions.map(action => new GeneralTask(action)));
        return this;
    }

    clear() {
        this.tasks = [];
    }
}
export {
    GeneralProcess
};