import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    GeneralProcess
} from "../../Core/GeneralProcess";

/** 
 * Represents a game component
 */
class GameComponent extends GeneralObject {
    constructor() {
        super();
        this.$start = new GeneralProcess(this).next(this.start);
        this.$update = new GeneralProcess(this).next(this.update);
        this.$dispose = new GeneralProcess(this).next(this.dispose);
    }
}

export {
    GameComponent
};