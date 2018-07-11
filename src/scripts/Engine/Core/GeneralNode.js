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
            this.proxy(child);
            child.parent = this;
            this.children.push(child);
        } else {
            throw ArgumentException("The child must be an instance of GeneralNode.");
        }
    }
}

export {
    GeneralNode
};