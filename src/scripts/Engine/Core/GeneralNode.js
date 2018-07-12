import {
    GeneralObject
} from "./GeneralObject";
import {
    ArgumentException
} from "../Common/Exception";

class GeneralNode extends GeneralObject {
    constructor() {
        super();
        this.parent = null;
        this.children = [];
    }

    addChild(child) {
        if (child instanceof GeneralNode) {
            child.parent = this;
            this.children.push(child);
            this.joint(child);
        } else {
            throw ArgumentException("The child must be an instance of GeneralNode.");
        }
    }

    removeChild(child) {
        let index = this.children.indexOf(child);
        if (index >= 0) {
            this.disjoint(child);
            child.parent = null;
            this.children.splice(index, 1);
        }
    }
}

export {
    GeneralNode
};