import {
    Vector2
} from "../../../Fundamental/Vector";
import {
    FlowProcess
} from "../Fundamental/FlowProcess";

/** 
 * Represents a view to present the visual object
 */
class GameView {
    constructor(target) {
        this.target = target;
        this.drawProcess = new FlowProcess(this).next(this.draw);
    }
    beginDraw(context) {
        var translation = this.target.transform.translation;
        var scale = this.target.transform.scale;
        var rotation = this.target.transform.rotation;
        var center = this.target.transform.center;
        var realCenter = translation.add(center);

        // transform
        var trans0 = new Vector2(realCenter.x * (1 - scale.x), realCenter.y * (1 - scale.y));
        context.translate(trans0.x, trans0.y);
        context.scale(scale.x, scale.y);

        context.translate(realCenter.x, realCenter.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        // draw
        this.drawProcess.process(context);

        // reset transform
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    beforeDraw() {}
    draw() {}
    afterDraw() {}
}

export {
    GameView
};