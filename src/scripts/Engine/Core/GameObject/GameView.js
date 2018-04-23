import {
    Vector2
} from "../../../Fundamental/Vector";
import {
    FlowProcess
} from "../Fundamental/FlowProcess";
import {
    GameObject
} from "./Base/GameObject";

/** 
 * Represents a view to present the visual object
 */
class GameView extends GameObject {
    constructor(target) {
        super(target);
        this.target = target;
        this.startProcess = new FlowProcess(this);
        this.updateProcess = new FlowProcess(this);
        this.renderProcess = new FlowProcess(this).next(this.setTransform).next(this.draw).next(this.restoreTransform);
    }

    start() {
        this.startProcess.process(...arguments);
    }

    update() {
        this.updateProcess.process(...arguments);
    }

    render() {
        this.renderProcess.process(...arguments);
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