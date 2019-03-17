import {
    State
} from "../State/State";

export interface IRule<T> {
    target: T;
    generate: (parent: State<T>) => State<T>[];
}

export class RuleGrammar implements IRule<string> {
    target: string;
    states: string[];

    constructor(target: string, letters: string = "") {
        this.target = target;
        this.states = letters.split("");
    }

    generate(parent: State<string>): State<string>[] {
        let result = [];
        this.states.forEach(element => {
            result.push(new State(element, parent, parent.generation + 1));
        });
        return result;
    }
}