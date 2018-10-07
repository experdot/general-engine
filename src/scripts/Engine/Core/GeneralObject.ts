import { Identifier } from "../Common/Identifier";
import { GeneralProcess } from "./GeneralProcess";

export class GeneralInterface {
    [name: string]: any[];
}

type GeneralProcessType<T extends GeneralInterface> = {
    [P in keyof T]?: GeneralProcess<T[P]>;
}

/**
 * Represent a general object
 */
export class GeneralObject<T extends GeneralInterface> {
    [propName: string]: any;

    identifier: any;
    joints: GeneralObject<any>[];
    processes: GeneralProcessType<T>;

    constructor() {
        this.identifier = Identifier.Unique;
        this.joints = [];
        (this.processes as any) = {};
    }

    joint(object: GeneralObject<any>) {
        GeneralProcess.setObjectSource(object, this);
        GeneralProcess.combine(this, object);
        this.joints.push(object);
        object.joints.push(this);
        return this;
    }

    disjoint(object: GeneralObject<any>) {
        this.joints.splice(this.joints.indexOf(object), 1);
        object.joints.splice(object.joints.indexOf(this), 1);
        GeneralProcess.seperate(this, object);
        GeneralProcess.setObjectSource(object, object);
        return this;
    }

    implements(generalInterface: T) {
        for (let key in generalInterface) {
            if (generalInterface[key] instanceof Array) {
                this.processes[key] = new GeneralProcess(this).next(this[key]);
            }
        }
    }
}