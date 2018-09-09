/**
 * Represent a state with parent and children state.
 */
class State {
    id: string;
    parent: State;
    children: State[];
    generation: number;

    constructor(id: string, parent: State, generation: number) {
        this.id = id;
        this.parent = parent;
        this.children = [];
        this.generation = generation;
    }
}
export {
    State
};