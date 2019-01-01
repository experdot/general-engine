import { GeneralObject, GeneralInterface } from "./GeneralObject";
import { GeneralTask } from "./GeneralTask";


interface GeneralProcessKeyValuePair {
    key: string;
    value: GeneralProcess<any>;
}

interface Test {
    a: string;
    b: number;
}

export class GeneralProcess<T extends any[]> {
    static find(object: GeneralObject<GeneralInterface>): GeneralProcessKeyValuePair[] {
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

    static combine(source: GeneralObject<GeneralInterface>, target: GeneralObject<GeneralInterface>) {
        GeneralProcess.every(source, target, (s, t) => {
            s.next((s: GeneralProcess<any>, ...args: any[]) => t.process(source, ...args), target.identifier);
        });
    }

    static seperate(source: GeneralObject<GeneralInterface>, target: GeneralObject<GeneralInterface>) {
        GeneralProcess.every(source, target, (s) => {
            s.remove(target.identifier);
        });
    }

    static every(source: GeneralObject<GeneralInterface>, target: GeneralObject<GeneralInterface>, hanlder: (source: GeneralProcess<any>, target: GeneralProcess<any>, key: string) => void) {
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

    thisArg: GeneralObject<GeneralInterface>;
    tasks: GeneralTask[];

    constructor(thisArg: GeneralObject<GeneralInterface>) {
        this.thisArg = thisArg;
        this.tasks = [];
    }

    process(source: GeneralObject<GeneralInterface> = this.thisArg, ...args: T): this {
        this.tasks.forEach(task => {
            task.run(this.thisArg, source, ...args);
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
            if (index >= 0) {
                this.tasks.splice(index, 1);
            }
        });
        return this;
    }

    clear(): this {
        this.tasks = [];
        return this;
    }
}
