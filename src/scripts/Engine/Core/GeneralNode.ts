import { GeneralObject, GeneralInterface } from "./GeneralObject";

export class GeneralNode<T extends GeneralInterface> extends GeneralObject<T> {
    parent: GeneralNode<GeneralInterface>;
    children: GeneralNode<GeneralInterface>[] = [];

    addChild(child: GeneralNode<GeneralInterface>) {
        child.parent = this;
        this.children.push(child);
        this.joint(child);
        return this;
    }

    removeChild(child: GeneralNode<GeneralInterface>) {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.disjoint(child);
            child.parent = null;
            this.children.splice(index, 1);
            return this.removeChild(child); // Remove duplicate objects
        }
        return this;
    }
}
