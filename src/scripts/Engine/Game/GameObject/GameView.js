import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    GeneralProcess
} from "../../Core/GeneralProcess";
import {
    Graphics
} from "../../Drawing/Graphics";

/** 
 * Represents a view to present the visual object
 */
class GameView extends GeneralObject {
    constructor() {
        super();
        this.target = undefined;
        this.render = new GeneralProcess(this).next(this.begin);
    }

    begin(source, context, ...args) {
        Graphics.transform(context, this.target.transform.toMatrix3x2(), () => {
            this.draw(source, context, ...args);
        });
    }

    draw() {}
}

export {
    GameView
};