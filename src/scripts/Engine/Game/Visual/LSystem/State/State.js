/**
 * Represent a state with parent and children state.
 */
class State {
    constructor(id, parent, generation) {
        this.id = id;
        this.parent = parent;
        this.children = [];
        this.generation = generation;
    }
}
export {
    State
};