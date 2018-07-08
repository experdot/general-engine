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

    constructor(thisArg) {
        this.thisArg = thisArg;
        this.source = thisArg;
        this.tasks = [];
    }

    setSource(source) {
        this.source = source;
    }

    process(...args) {
        this.tasks.forEach(element => {
            element.run(this.thisArg, this.source, ...args);
        });
    }

    before(...actions) {
        this.tasks.unshift(...this._convertToTasks(actions));
        return this;
    }

    next(...actions) {
        this.tasks.push(...this._convertToTasks(actions));
        return this;
    }

    insert(index, ...actions) {
        this.tasks.splice(index, 0, ...this._convertToTasks(actions));
        return this;
    }

    clear() {
        this.tasks = [];
    }

    _convertToTasks(actions) {
        return actions.filter(a => a instanceof Function).map(action => new GeneralTask(action));
    }
}

export {
    GeneralProcess
};