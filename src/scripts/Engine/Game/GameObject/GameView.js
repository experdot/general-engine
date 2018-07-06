import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    GeneralProcess
} from "../../Core/GeneralProcess";

/** 
 * Represents a view to present the visual object
 */
class GameView extends GeneralObject {
    constructor() {
        super();
        this.target = undefined;
        this.render = new GeneralProcess(this).next(this.draw);
    }

    draw() {}
}

export {
    GameView
};