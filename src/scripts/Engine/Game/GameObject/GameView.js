import {
    GeneralProcess
} from "../../Core/GeneralProcess";
import {
    GameNode
} from "../GameNode/GameNode";

/** 
 * Represents a view to present the visual object
 */
class GameView extends GameNode {
    constructor() {
        super();
        this.$render = new GeneralProcess(this).next(this.render);
    }
}

export {
    GameView
};