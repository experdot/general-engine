import {
    IState,
    State,
    TwoDementionState
} from "../State/State";
import { Vector2 } from "../../../../Engine/Numerics/Vector2";

export interface IRule<T> {
    target: T;
    generate: (parent: IState<T>) => IState<T>[];
}

export class GrammarRule implements IRule<string> {
    target: string;
    states: string[];

    constructor(target: string, letters: string = "") {
        this.target = target;
        this.states = letters.split("");
    }

    generate(parent: State<string>): State<string>[] {
        const result = [];
        this.states.forEach(element => {
            result.push(new State(element, parent, parent.generation + 1));
        });
        return result;
    }
}

export class TwoDementionRule implements IRule<string> {
    target: string;
    states: string[];
    rank: number = 3;

    constructor(target: string, letters: string = "") {
        this.target = target;
        this.states = letters.split("");
    }

    generate(parent: TwoDementionState<string>): TwoDementionState<string>[] {
        const result = [];
        parent.location = parent.location.multiply(this.rank);
        this.states.forEach((element, index) => {
            const location = parent.location.add(new Vector2(index % this.rank, Math.floor(index / this.rank)));
            result.push(new TwoDementionState(element, parent, parent.generation + 1, location));
        });
        return result;
    }
}