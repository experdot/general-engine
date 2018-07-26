import {
    GeneralTask
} from "./GeneralTask";
import { GeneralObject } from "./GeneralObject";

class GeneralProcess {
    static find(object: GeneralObject) {
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

    static setObjectSource(object: GeneralObject, source: GeneralObject) {
        GeneralProcess.find(object).forEach(element => {
            element.value.setSource(source);
        });
    }

    static combine(source: GeneralObject, target: GeneralObject) {
        GeneralProcess.every(source, target, (s, t) => {
            s.next((s, ...args) => t.process(...args), target.identifier);
        });
    }

    static seperate(source: GeneralObject, target: GeneralObject) {
        GeneralProcess.every(source, target, (s) => {
            s.remove(target.identifier);
        });
    }

    static every(source: GeneralObject, target: GeneralObject, hanlder: { (source: GeneralProcess, target: GeneralProcess, key: string) }) {
        GeneralProcess.find(source).forEach(element => {
            const sourceProcess = source[element.key];
            const targetProcess = target[element.key];
            if (targetProcess instanceof GeneralProcess) {
                hanlder(sourceProcess, targetProcess, element.key);
            }
        });
    }

    public thisArg: object;
    public source: object;
    public tasks: GeneralTask[];

    constructor(thisArg: object) {
        this.thisArg = thisArg;
        this.source = thisArg;
        this.tasks = [];
    }

    setSource(source: object) {
        this.source = source;
    }

    process(...args) {
        this.tasks.forEach(element => {
            element.run(this.thisArg, this.source, ...args);
        });
    }

    before(action: { (...args) }, identifier?: number) {
        action && this.tasks.unshift(new GeneralTask(action, identifier));
        return this;
    }

    next(action: { (...args) }, identifier?: number) {
        action && this.tasks.push(new GeneralTask(action, identifier));
        return this;
    }

    remove(identifier?: number) {
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