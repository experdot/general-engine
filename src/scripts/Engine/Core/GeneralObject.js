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
        return object;
    }

    disjoint(object) {
        GeneralProcess.seperate(this, object);
        GeneralProcess.setObjectSource(object, object);
        return object;
    }
}



export {
    GeneralObject
};