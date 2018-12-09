import { GeneralObject } from "./GeneralObject";
import { GeneralTask } from "./GeneralTask";

export class GeneralProcess<T extends any[]> {
    static find(object: GeneralObject<any>): GeneralProcessKeyValuePair[] {
        const result: GeneralProcessKeyValuePair[] = [];
        const processes = object.processes;
        for (const key in processes) {
            result.push({
                key: key,
                value: processes[key]
            });
        }
        return result;
    }

    static setObjectSource(object: GeneralObject<any>, source: GeneralObject<any>) {
        GeneralProcess.find(object).forEach(element => {
            element.value.setSource(source);
        });
    }

    static combine(source: GeneralObject<any>, target: GeneralObject<any>) {
        GeneralProcess.every(source, target, (s, t) => {
            s.next((s: GeneralProcess<any>, ...args: any[]) => t.process(...args), target.identifier);
        });
    }

    static seperate(source: GeneralObject<any>, target: GeneralObject<any>) {
        GeneralProcess.every(source, target, (s) => {
            s.remove(target.identifier);
        });
    }

    static every(source: GeneralObject<any>, target: GeneralObject<any>, hanlder: (source: GeneralProcess<any>, target: GeneralProcess<any>, key: string) => void) {
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

    setSource(source: object): this {
        this.source = source;
        return this;
    }

    process<T extends any[]>(...args: T): this {
        this.tasks.forEach(element => {
            element.run(this.thisArg, this.source, ...args);
        });
        return this;
    }

    before(action: Function, identifier?: number): this {
        action && this.tasks.unshift(new GeneralTask(action, identifier));
        return this;
    }

    next(action: Function, identifier?: number): this {
        action && this.tasks.push(new GeneralTask(action, identifier));
        return this;
    }

    remove(identifier?: number): this {
        const tasks = this.tasks.filter(v => v.identifier === identifier);
        tasks.forEach(task => {
            const index = this.tasks.indexOf(task);
            this.tasks.splice(index, 1);
        });
        return this;
    }

    clear(): this {
        this.tasks = [];
        return this;
    }
}

class GeneralProcessKeyValuePair {
    key: string;
    value: GeneralProcess<any>;
}
