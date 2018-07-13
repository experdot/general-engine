import {
    GeneralProcess
} from "./GeneralProcess";
import {
    Identifier
} from "../Common/Identifier";

/**
 * Represent a general object
 */
class GeneralObject {
    constructor() {
        this.identifier = Identifier.Unique;
        this.joints = [];
    }

    joint(object) {
        GeneralProcess.setObjectSource(object, this);
        GeneralProcess.combine(this, object);
        this.joints.push(object);
        object.joints.push(this);
        return object;
    }

    disjoint(object) {
        this.joints.splice(this.joints.indexOf(object), 1);
        object.joints.splice(object.joints.indexOf(this), 1);
        GeneralProcess.seperate(this, object);
        GeneralProcess.setObjectSource(object, object);
        return object;
    }
}



export {
    GeneralObject
};