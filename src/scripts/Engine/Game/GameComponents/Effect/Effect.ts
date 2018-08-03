import { GeneralObject } from "../../../Core/GeneralObject";
import { GameEffectInterface } from "../../GameInterface/GameInterface";
import { ColorHelper, Colors } from "../../../UI/Color";


export class GhostEffect extends GeneralObject {
    fillColor;
    gradientNumber;
    direct

    constructor(fill = Colors.Black, gradient = 10, direct = true) {
        super();
        this.fillColor = fill;
        this.gradientNumber = gradient;
        this.direct = direct;

        this.implements(GameEffectInterface);
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

export class GhostImageEffect extends GeneralObject {
    image;
    alpha;
    direct;

    constructor(src, alpha = 1, direct = true) {
        super();
        this.image = new Image();
        this.image.src = src;
        this.alpha = alpha;
        this.direct = direct;

        this.implements(GameEffectInterface);
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