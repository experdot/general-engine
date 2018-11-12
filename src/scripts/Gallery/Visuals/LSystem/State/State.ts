/**
 * Represent a state with parent and children state.
 */
class State<T> {
    value: T;
    parent: State<T>;
    children: State<T>[];
    generation: number;

    constructor(value: T, parent: State<T>, generation: number) {
        this.value = value;
        this.parent = parent;
        this.children = [];
        this.generation = generation;
    }

    next() {
        return new State(this.value, this.parent, this.generation + 1);
    }
}
export {
    State
};