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
                    this._combineArray(tempStates, state.children);
                } else {
                    state.children = this._getDefaultState(state);
                    this._combineArray(tempStates, state.children);
                }
            });
            this.states = [];
            this._combineArray(this.states, tempStates);
        }
    }

    _getDefaultState(state) {
        let result = [];
        result.push(new State(state.id, state, state.generation + 1));
        return result;
    }

    _combineArray(array1, array2) {
        array2.forEach(element => {
            array1.push(element);
        });
    }
}

export {
    LSystem
};