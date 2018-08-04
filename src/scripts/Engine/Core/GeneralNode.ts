import { GeneralObject } from "./GeneralObject";

export class GeneralNode extends GeneralObject {
    parent: GeneralNode;
    children: GeneralNode[];

    constructor() {
        super();
        this.parent = null;
        this.children = [];
    }

    addChild(child: GeneralNode) {
        child.parent = this;
        this.children.push(child);
        this.joint(child);
        return this;
    }

    removeChild(child: GeneralNode) {
        let index = this.children.indexOf(child);
        if (index >= 0) {
            this.disjoint(child);
            child.parent = null;
            this.children.splice(index, 1);
        }
        return this;
    }
}
