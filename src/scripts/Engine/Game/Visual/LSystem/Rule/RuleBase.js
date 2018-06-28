import {
    State
} from "../State/State";

class RuleBase {
    constructor(target, priority) {
        this.target = target;
        this.priority = priority;
    }
}

class RuleGrammar extends RuleBase {
    constructor(target, priority, letters = "") {
        super(target, priority);
        this.states = letters.split("");
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
    RuleGrammar
};