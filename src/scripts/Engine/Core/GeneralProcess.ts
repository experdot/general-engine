import { GeneralObject } from "./GeneralObject";
import { GeneralTask } from "./GeneralTask";

export class GeneralProcess {
    static find(object: GeneralObject<any>): GeneralProcessKeyValuePair[] {
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

    static setObjectSource(object: GeneralObject<any>, source: GeneralObject<any>) {
        GeneralProcess.find(object).forEach(element => {
            element.value.setSource(source);
        });
    }

    static combine(source: GeneralObject<any>, target: GeneralObject<any>) {
        GeneralProcess.every(source, target, (s, t) => {
            s.next((s: GeneralProcess, ...args: any[]) => t.process(...args), target.identifier);
        });
    }

    static seperate(source: GeneralObject<any>, target: GeneralObject<any>) {
        GeneralProcess.every(source, target, (s) => {
            s.remove(target.identifier);
        });
    }

    static every(source: GeneralObject<any>, target: GeneralObject<any>, hanlder: (source: GeneralProcess, target: GeneralProcess, key: string) => void) {
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

    process(...args: any[]): this {
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
        let tasks = this.tasks.filter(v => v.identifier === identifier);
        tasks.forEach(task => {
            let index = this.tasks.indexOf(task);
            this.tasks.splice(index, 1);
        });
        return this;
    }

    clear(): this {
        this.tasks = [];
        return this;
    }
}

export interface VoidGeneralProcess extends GeneralProcess {
    process(): this;
}

export interface TypedGeneralProcess<T> extends GeneralProcess {
    process(arg: T): this;
}

export interface TypedGeneralProcess2<T1, T2> extends GeneralProcess {
    process(arg1: T1, arg2: T2): this;
}

export interface TypedGeneralProcess3<T1, T2, T3> extends GeneralProcess {
    process(arg1: T1, arg2: T2, arg3: T3): this;
}

export interface TypedGeneralProcess4<T1, T2, T3, T4> extends GeneralProcess {
    process(arg1: T1, arg2: T2, arg3: T3, arg4: T4): this;
}

export interface TypedGeneralProcess5<T1, T2, T3, T4, T5> extends GeneralProcess {
    process(arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): this;
}


class GeneralProcessKeyValuePair {
    key: string;
    value: GeneralProcess;
}
