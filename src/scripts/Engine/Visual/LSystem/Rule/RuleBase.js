import {
    State
} from "../State/State";

class RuleBase {
    constructor(target, priority) {
        this.target = target;
        this.priority = priority;
    }
}

class RuleTree extends RuleBase {
    constructor(target, priority) {
        super(target, priority);
        this.states = "FF+[+F-F-F]-[-F+F+F]".split("");
    }
    generate(parent) {
        let result = [];
        this.states.forEach(element => {
            result.push(new State(element, parent, parent.generation + 1));
        });
        return result;
    }
}

export {
    RuleBase,
    RuleTree
};