import {
    GeneralProcess
} from "./GeneralProcess";

/**
 * Represent a general object
 */
class GeneralObject {
    constructor() {
        this.attachements = [];
    }

    join(object = new GeneralObject(), sync = true) {
        GeneralProcess.find(object).forEach(element => {
            element.value.setSource(this);
        });
        sync && this.sync(object);
        return object;
    }

    attach(object, sync = true) {
        this.attachements.push(object);
        sync && this.sync(object);
        return object;
    }

    sync(object) {
        GeneralProcess.find(object).forEach(element => {
            const source = this[element.key];
            const target = object[element.key];
            if (target && source instanceof GeneralProcess && target instanceof GeneralProcess) {
                source.next((s, ...args) => target.process(...args));
            }
        });
    }
}

export {
    GeneralObject
};