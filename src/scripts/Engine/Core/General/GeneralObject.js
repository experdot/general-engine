import {
    FlowProcess
} from "../Fundamental/FlowProcess";

/**
 * Represent a general object
 */
class GeneralObject {
    constructor() {
        this.name = "";
        this.start = new FlowProcess(this);
        this.update = new FlowProcess(this);
    }
}

export {
    GeneralObject
};