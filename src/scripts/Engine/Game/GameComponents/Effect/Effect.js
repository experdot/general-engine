import {
    ColorHelper,
    Colors
} from "../../../UI/Color";
import {
    GameVisual
} from "../../GameObject/GameVisual";

class GhostEffect extends GameVisual {
    constructor(fill = Colors.Black, gradient = 10) {
        super();
        this.fillColor = fill;
        this.gradientNumber = gradient;
        this.start.next(source => {
            const w = source.world.width;
            const h = source.world.height;
            source.view.render.next((s, context) => {
                context.fillStyle = this.fillColor.rgba;
                context.fillRect(0, 0, w, h);
            }, 0);
        });
        this.update.next(() => {
            if (Math.random() > 0.5) {
                this.fillColor = ColorHelper.getGradientRandomColor(this.fillColor, this.gradientNumber);
            }
        });
    }
}

export {
    GhostEffect
};