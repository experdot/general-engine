import {
    GeneralProcess
} from "../../Core/GeneralProcess";
import {
    GameNode
} from "../GameNode/GameNode";

/** 
 * Represents a GUI attached to the visual object
 */
class GameGUI extends GameNode {
    constructor() {
        super();
        this.$gui = new GeneralProcess(this).next(this.gui);
    }
}

export {
    GameGUI
};