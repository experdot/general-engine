import {
    RuleSet
} from "./Rule/RuleSet";
import {
    State
} from "./State/State";

class LSystem {
    constructor() {
        this.states = [];
        this.ruleSets = {};
        this.root = {};
    }

    initRoot(root) {
        this.root = root;
        this.states = [];
        this.states.push(root);
    }
    addRule(rule) {
        if (!this.ruleSets[rule.target]) {
            this.ruleSets[rule.target] = new RuleSet();
        }
        this.ruleSets[rule.target].add(rule);
    }
    generate(count = 1) {
        for (let index = 0; index < count; index++) {
            let tempStates = [];
            this.states.forEach(state => {
                if (this.ruleSets[state.id]) {
                    state.children = this.ruleSets[state.id].rules[0].generate(state);
                    tempStates.push(...state.children);

                } else {
                    state.children = this._getDefaultState(state);
                    tempStates.push(...state.children);
                }
            });
            this.states = [];
            this.states.push(...tempStates);
        }
    }

    _getDefaultState(state) {
        let result = [];
        result.push(new State(state.id, state, state.generation + 1));
        return result;
    }
}

export {
    LSystem
};