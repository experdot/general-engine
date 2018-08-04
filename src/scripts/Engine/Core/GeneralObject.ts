import { Identifier } from "../Common/Identifier";
import { GeneralProcess } from "./GeneralProcess";
import { GeneralInterface } from "./GeneralInterface";

/**
 * Represent a general object
 */
export class GeneralObject {
    [propName: string]: any;

    identifier: any;
    joints: GeneralObject[];

    constructor() {
        this.identifier = Identifier.Unique;
        this.joints = [];
    }

    joint(object: GeneralObject) {
        GeneralProcess.setObjectSource(object, this);
        GeneralProcess.combine(this, object);
        this.joints.push(object);
        object.joints.push(this);
        return this;
    }

    disjoint(object: GeneralObject) {
        this.joints.splice(this.joints.indexOf(object), 1);
        object.joints.splice(object.joints.indexOf(this), 1);
        GeneralProcess.seperate(this, object);
        GeneralProcess.setObjectSource(object, object);
        return this;
    }

    implements(generalInterface: GeneralInterface) {
        generalInterface.processes.forEach(element => {
            if (!this[element]) {
                this[element] = new GeneralProcess(this).next(this[element.slice(1)]);
            }
        });
    }
}