import {
    GeneralProcess
} from "../../Core/GeneralProcess";
import {
    GeneralNode
} from "../../Core/GeneralNode";

/** 
 * Represents a game component
 */
class GameNode extends GeneralNode {
    constructor() {
        super();
        this.$start = new GeneralProcess(this).next(this.start);
        this.$dispose = new GeneralProcess(this).next(this.dispose);
    }

    addChild(child, start = defaults.start) {
        defaults.start = start;
        super.addChild(child);
        defaults.start = false;
    }

    removeChild(child, dispose = defaults.dispose) {
        defaults.dispose = dispose;
        super.removeChild(child);
        defaults.dispose = true;
    }

    joint(object, start = defaults.start) {
        let result = super.joint(object);
        start && object.$start.process();
        return result;
    }

    disjoint(object, dispose = defaults.dispose) {
        dispose && object.$dispose.process();
        return super.disjoint(object);
    }
}


const defaults = {
    start: false,
    dispose: true
};

export {
    GameNode
};