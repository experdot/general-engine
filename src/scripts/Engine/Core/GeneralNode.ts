import { GeneralObject, GeneralInterface } from "./GeneralObject";

export class GeneralNode<T extends GeneralInterface> extends GeneralObject<T> {
    parent: GeneralNode<any>;
    children: GeneralNode<any>[];

    constructor() {
        super();
        this.parent = null;
        this.children = [];
    }

    addChild(child: GeneralNode<any>) {
        child.parent = this;
        this.children.push(child);
        this.joint(child);
        return this;
    }

    removeChild(child: GeneralNode<any>) {
        let index = this.children.indexOf(child);
        if (index >= 0) {
            this.disjoint(child);
            child.parent = null;
            this.children.splice(index, 1);
        }
        return this;
    }
}
