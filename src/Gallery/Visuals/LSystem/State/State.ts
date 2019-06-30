import { Vector2 } from "../../../../Engine/Numerics/Vector2";

export interface IState<T> {
    value: T;
    parent: IState<T>;
    children: IState<T>[];
    generation: number;

    next(): IState<T>;
}

export class State<T> implements IState<T> {
    value: T;
    parent: IState<T>;
    children: IState<T>[];
    generation: number;

    constructor(value: T, parent: IState<T>, generation: number) {
        this.value = value;
        this.parent = parent;
        this.children = [];
        this.generation = generation;
    }

    next() {
        return new State(this.value, this.parent, this.generation + 1);
    }
}

export class TwoDementionState<T> extends State<T>  {
    location: Vector2;

    constructor(value: T, parent: IState<T>, generation: number, location = Vector2.Zero) {
        super(value, parent, generation);
        this.location = location;
    }
}