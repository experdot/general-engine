import {
    GeneralObject
} from "./GeneralObject";
import {
    ArgumentException
} from "../Common/Exception";

class GeneralNode extends GeneralObject {
    public parent: GeneralNode;
    public children: GeneralNode[];

    constructor() {
        super();
        this.parent = null;
        this.children = [];
    }

    addChild(child: GeneralNode) {
        child.parent = this;
        this.children.push(child);
        this.joint(child);
    }

    removeChild(child: GeneralNode) {
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