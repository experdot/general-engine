import {
    GeneralTask
} from "./GeneralTask";

class GeneralProcess {
    static find(object) {
        let result = [];
        for (const key in object) {
            const value = object[key];
            if (value instanceof GeneralProcess) {
                result.push({
                    key,
                    value
                });
            }
        }
        return result;
    }

    static setObjectSource(object, source) {
        GeneralProcess.find(object).forEach(element => {
            element.value.setSource(source);
        });
    }

    static combine(source, target) {
        GeneralProcess.every(source, target, (s, t) => {
            s.next((s, ...args) => t.process(...args), target.identifier);
        });
    }

    static seperate(source, target) {
        GeneralProcess.every(source, target, (s) => {
            s.remove(target.identifier);
        });
    }

    static every(source, target, hanlder) {
        GeneralProcess.find(source).forEach(element => {
            const sourceProcess = source[element.key];
            const targetProcess = target[element.key];
            if (targetProcess instanceof GeneralProcess) {
                hanlder(sourceProcess, targetProcess, element.key);
            }
        });
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

    before(action, identifier) {
        this.tasks.unshift(new GeneralTask(action, identifier));
        return this;
    }

    next(action, identifier) {
        this.tasks.push(new GeneralTask(action, identifier));
        return this;
    }

    remove(identifier) {
        let tasks = this.tasks.filter(v => v.identifier === identifier);
        tasks.forEach(task => {
            let index = this.tasks.indexOf(task);
            this.tasks.splice(index, 1);
        });
    }

    clear() {
        this.tasks = [];
    }
}

export {
    GeneralProcess
};