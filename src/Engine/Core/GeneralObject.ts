import { Identifier } from "../Common/Identifier";
import { GeneralProcess } from "./GeneralProcess";

export class GeneralInterface {
    [name: string]: any[];
}

type GeneralProcessesType<TThis, T extends GeneralInterface> = {
    [P in keyof T]?: GeneralProcess<TThis, T[P]>;
}

/**
 * Represent a general object
 */
export class GeneralObject<T extends GeneralInterface> {
    [propName: string]: any;

    identifier: number = Identifier.unique;
    joints: GeneralObject<any>[] = [];
    processes: GeneralProcessesType<this, T> = {};

    joint(object: GeneralObject<any>) {
        GeneralProcessHelper.combine(this, object);
        this.joints.push(object);
        object.joints.push(this);
        return this;
    }

    disjoint(object: GeneralObject<any>) {
        const index = this.joints.indexOf(object);
        if (index >= 0) {
            this.joints.splice(this.joints.indexOf(object), 1);
            object.joints.splice(object.joints.indexOf(this), 1);
            GeneralProcessHelper.seperate(this, object);
            return this.disjoint(object); // Disjoint duplicate objects
        }
        return this;
    }

    implements(generalInterface: T) {
        for (const key in generalInterface) {
            if (generalInterface[key] instanceof Array) {
                if (!this.processes[key]) {
                    this.processes[key] = new GeneralProcess(this).next(this[key]);
                }
            }
        }
    }
}


interface GeneralProcessKeyValuePair {
    key: string;
    value: GeneralProcess<any, any>;
}

class GeneralProcessHelper {
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
        this.every(source, target, (s, t) => {
            s.next((s: GeneralProcess<any, any>, ...args: any[]) => t.process(source, ...args), target.identifier);
        });
    }

    static seperate(source: GeneralObject<GeneralInterface>, target: GeneralObject<GeneralInterface>) {
        this.every(source, target, (s) => {
            s.remove(target.identifier);
        });
    }

    private static every(source: GeneralObject<GeneralInterface>, target: GeneralObject<GeneralInterface>, hanlder: (source: GeneralProcess<any, any>, target: GeneralProcess<any, any>, key: string) => void) {
        const sourceProcesses = source.processes;
        const targetProcesses = target.processes;
        this.find(source).forEach(element => {
            const sourceProcess = sourceProcesses[element.key];
            const targetProcess = targetProcesses[element.key];
            if (targetProcess instanceof GeneralProcess) {
                hanlder(sourceProcess, targetProcess, element.key);
            }
        });
    }
}