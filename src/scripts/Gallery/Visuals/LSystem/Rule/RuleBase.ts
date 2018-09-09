import {
    State
} from "../State/State";

export interface IRule<T> {
    target: T;
    priority: number;
    generate: (parent: State) => State[];
}

export class RuleGrammar implements IRule<string> {
    target: string;
    priority: number;
    states: string[];

    constructor(target: string, priority: number, letters: string = "") {
        this.target = target;
        this.priority = priority;
        this.states = letters.split("");
    }

    generate(parent: State): State[] {
        let result = [];
        this.states.forEach(element => {
            result.push(new State(element, parent, parent.generation + 1));
        });
        return result;
    }
}