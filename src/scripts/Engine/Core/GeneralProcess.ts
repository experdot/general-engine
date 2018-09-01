import { GeneralObject } from "./GeneralObject";
import { GeneralTask } from "./GeneralTask";

export class GeneralProcess {
    static find(object: GeneralObject): GeneralProcessKeyValuePair[] {
        let result: GeneralProcessKeyValuePair[] = [];
        let processes = object.processes;
        for (const key in processes) {
            result.push({
                key: key,
                value: processes[key]
            });
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
            s.next((s: GeneralProcess, ...args: any[]) => t.process(...args), target.identifier);
        });
    }

    static seperate(source: GeneralObject, target: GeneralObject) {
        GeneralProcess.every(source, target, (s) => {
            s.remove(target.identifier);
        });
    }

    static every(source: GeneralObject, target: GeneralObject, hanlder: (source: GeneralProcess, target: GeneralProcess, key: string) => void) {
        const sourceProcesses = source.processes;
        const targetProcesses = target.processes;
        GeneralProcess.find(source).forEach(element => {
            const sourceProcess = sourceProcesses[element.key];
            const targetProcess = targetProcesses[element.key];
            if (targetProcess instanceof GeneralProcess) {
                hanlder(sourceProcess, targetProcess, element.key);
            }
        });
    }

    thisArg: object;
    source: object;
    tasks: GeneralTask[];

    constructor(thisArg: object) {
        this.thisArg = thisArg;
        this.source = thisArg;
        this.tasks = [];
    }

    setSource(source: object) {
        this.source = source;
    }

    process(...args: any[]) {
        this.tasks.forEach(element => {
            element.run(this.thisArg, this.source, ...args);
        });
    }

    before(action: Function, identifier?: number) {
        action && this.tasks.unshift(new GeneralTask(action, identifier));
        return this;
    }

    next(action: Function, identifier?: number) {
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


class GeneralProcessKeyValuePair {
    key: string;
    value: GeneralProcess;
}
