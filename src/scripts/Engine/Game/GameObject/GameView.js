import {
    Vector2
} from "../../../Engine/Numerics/Vector2";
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
    constructor(target) {
        super();
        this.target = target;
        this.render = new GeneralProcess(this).next([this.setTransform, this.draw, this.restoreTransform]);
    }

    setTransform(context) {
        let translation = this.target.transform.translation;
        let scale = this.target.transform.scale;
        let rotation = this.target.transform.rotation;
        let center = this.target.transform.center;
        let realCenter = translation.add(center);

        // transform
        let trans0 = new Vector2(realCenter.x * (1 - scale.x), realCenter.y * (1 - scale.y));
        context.translate(trans0.x, trans0.y);
        context.scale(scale.x, scale.y);

        context.translate(realCenter.x, realCenter.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);
    }

    restoreTransform(context) {
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    draw() {}
}

export {
    GameView
};