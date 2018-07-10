import {
    ColorHelper,
    Colors
} from "../../../UI/Color";
import {
    GameVisual
} from "../../GameObject/GameVisual";

class GhostEffect extends GameVisual {
    constructor(fill = Colors.Black, gradient = 10, direct = true) {
        super();
        this.fillColor = fill;
        this.gradientNumber = gradient;
        this.direct = direct;
    }

    start(source) {
        if (this.direct) {
            source.$render.before((s, context) => {
                this.effect(context);
            });
        }
    }

    update() {
        if (Math.random() > 0.5) {
            this.fillColor = ColorHelper.gradientRandom(this.fillColor, this.gradientNumber);
        }
    }

    effect(context) {
        const w = context.canvas.width;
        const h = context.canvas.height;
        context.fillStyle = this.fillColor.rgba;
        context.fillRect(0, 0, w, h);
    }
}

export {
    GhostEffect
};