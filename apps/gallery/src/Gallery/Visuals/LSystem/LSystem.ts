import {
    RuleSet
} from "./Rule/RuleSet";
import {
    State, IState
} from "./State/State";
import { IRule } from "./Rule/Rule";

class LSystem {

    states: IState<string>[] = [];
    ruleSets: { [name: string]: RuleSet<string> };
    root: IState<string>;

    constructor() {
        this.states = [];
        this.ruleSets = {};
    }

    initRoot(root: IState<string>) {
        this.root = root;
        this.states = [];
        this.states.push(root);
    }

    addRule(rule: IRule<string>) {
        if (!this.ruleSets[rule.target]) {
            this.ruleSets[rule.target] = new RuleSet();
        }
        this.ruleSets[rule.target].add(rule);
    }

    generate(count: number = 1) {
        for (let index = 0; index < count; index++) {
            let tempStates = [];
            this.states.forEach(state => {
                if (this.ruleSets[state.value]) {
                    state.children = this.ruleSets[state.value].generate(state, index);
                    this.combineArray(tempStates, state.children);
                } else {
                    state.children = this.getDefaultState(state);
                    this.combineArray(tempStates, state.children);
                }
            });
            this.states = [];
            this.combineArray(this.states, tempStates);
        }
    }

    private getDefaultState(state: IState<string>) {
        let result = [];
        result.push(new State(state.value, state, state.generation + 1));
        return result;
    }

    private combineArray(array1: any[], array2: any[]) {
        array2.forEach(element => {
            array1.push(element);
        });
    }
}

export {
    LSystem
};