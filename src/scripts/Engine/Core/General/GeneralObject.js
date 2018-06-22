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

    proxy(action, sync = true) {
        let p = new GeneralObject();
        p.start.setContext(this);
        p.update.setContext(this);
        if (sync) {
            this.start.next(() => {
                p.start.process(...arguments);
            });
            this.update.next(() => {
                p.update.process(...arguments);
            });
        }
        action && action(p, this);
        return p;
    }
}

export {
    GeneralObject
};