import {
    ColorHelper,
    Colors
} from "../../../UI/Color";
import {
    GameNode
} from "../../GameNode/GameNode";
import {
    GeneralProcess
} from "../../../Core/GeneralProcess";

class GhostEffect extends GameNode {
    constructor(fill = Colors.Black, gradient = 10, direct = true) {
        super();
        this.fillColor = fill;
        this.gradientNumber = gradient;
        this.direct = direct;

        this.$update = new GeneralProcess(this).next(this.update);
    }

    start(source) {
        if (this.direct) {
            source.$render.before((s, context) => this.effect(context), this.identifier);
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

class GhostImageEffect extends GameNode {
    constructor(src, alpha = 1, direct = true) {
        super();
        this.image = new Image();
        this.image.src = src;
        this.alpha = alpha;
        this.direct = direct;
    }

    start(source) {
        if (this.direct) {
            source.$render.before((s, context) => this.effect(context));
        }
    }

    effect(context) {
        let alpha = context.globalAlpha;
        context.globalAlpha = this.alpha;
        context.drawImage(this.image, 0, 0);
        context.globalAlpha = alpha;
    }
}

export {
    GhostEffect,
    GhostImageEffect
};