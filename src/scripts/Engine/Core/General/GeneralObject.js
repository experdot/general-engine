import {
    GeneralProcess
} from "./GeneralProcess";

/**
 * Represent a general object
 */
class GeneralObject {
    constructor() {
        this.start = new GeneralProcess(this);
        this.update = new GeneralProcess(this);
    }
}

export {
    GeneralObject
};