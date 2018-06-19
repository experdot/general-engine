import {
    Color
} from "../../../Fundamental/Color";
import {
    GameView
} from "../GameObject/GameView";

class GameWorldView extends GameView {
    constructor(target) {
        super(target);
        this.isClear = false;
        this.clearColor = new Color();
    }

    draw(context) {
        if (this.isClear) {
            context.fillStyle = this.clearColor.getRGBAValue();
            context.beginPath();
            context.fillRect(0, 0, this.target.width, this.target.height);
            context.closePath();
        }
        this.target.gameVisuals.forEach(element => {
            element.view && element.view.render.process(context);
        });
    }
}

export {
    GameWorldView
};