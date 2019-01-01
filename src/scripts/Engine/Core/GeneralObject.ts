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

    identifier: number = Identifier.unique;
    joints: GeneralObject<any>[] = [];
    processes: GeneralProcessType<T> = {};

    joint(object: GeneralObject<any>) {
        GeneralProcess.combine(this, object);
        this.joints.push(object);
        object.joints.push(this);
        return this;
    }

    disjoint(object: GeneralObject<any>) {
        const index = this.joints.indexOf(object);
        if (index >= 0) {
            this.joints.splice(this.joints.indexOf(object), 1);
            object.joints.splice(object.joints.indexOf(this), 1);
            GeneralProcess.seperate(this, object);
            return this.disjoint(object); // Disjoint duplicate objects
        }
        return this;
    }

    implements(generalInterface: T) {
        for (const key in generalInterface) {
            if (generalInterface[key] instanceof Array) {
                this.processes[key] = new GeneralProcess(this).next(this[key]);
            }
        }
    }
}