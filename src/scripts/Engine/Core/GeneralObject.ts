import { Identifier } from "../Common/Identifier";
import { GeneralProcess, TypedGeneralProcess } from "./GeneralProcess";
import { GeneralInterface } from "./GeneralInterface";

/**
 * Represent a general object
 */
export class GeneralObject<T> {
    [propName: string]: any;

    identifier: any;
    joints: GeneralObject<any>[];
    processes: T;

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

    implements(generalInterface: GeneralInterface) {
        generalInterface.processes.forEach(element => {
            if (!this.processes[element]) {
                this.processes[element] = new GeneralProcess(this).next(this[element]);
            }
        });
    }
}