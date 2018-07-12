import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    GeneralProcess
} from "../../Core/GeneralProcess";

/** 
 * Represents a GUI attached to the visual object
 */
class GameGUI extends GeneralObject {
    constructor() {
        super();
        this.$gui = new GeneralProcess(this).next(this.gui);
        this.$dispose = new GeneralProcess(this).next(this.dispose);
    }
}

export {
    GameGUI
};