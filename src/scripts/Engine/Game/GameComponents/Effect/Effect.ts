import { GeneralObject } from "../../../Core/GeneralObject";
import { ColorHelper, Colors, Color } from "../../../UI/Color";
import { GameVisual } from "../../GameObject/GameVisual";
import { GameEffectInterface } from "../../GameInterface/GameInterface";


export class GhostEffect extends GeneralObject<GameEffectInterface> {
    fillColor: Color;
    gradientNumber: number;
    direct: boolean;

    constructor(fill = Colors.Black, gradient = 10, direct = true) {
        super();
        this.fillColor = fill;
        this.gradientNumber = gradient;
        this.direct = direct;

        this.implements(new GameEffectInterface());
    }

    start(source: GameVisual) {
        if (this.direct) {
            source.processes.render.before((s: GameVisual, context: CanvasRenderingContext2D) => this.effect(context), this.identifier);
        }
    }

    update() {
        if (Math.random() > 0.5) {
            this.fillColor = ColorHelper.gradientRandom(this.fillColor, this.gradientNumber);
        }
    }

    effect(context: CanvasRenderingContext2D) {
        const w = context.canvas.width;
        const h = context.canvas.height;
        context.fillStyle = this.fillColor.rgba;
        context.fillRect(0, 0, w, h);
    }
}

export class GhostImageEffect extends GeneralObject<GameEffectInterface> {
    image: HTMLImageElement;
    alpha: number;
    direct: boolean;

    constructor(src: string, alpha = 1, direct = true) {
        super();
        this.image = new Image();
        this.image.src = src;
        this.alpha = alpha;
        this.direct = direct;

        this.implements(new GameEffectInterface());
    }

    start(source: GameVisual) {
        if (this.direct) {
            source.processes.render.before((s: GameVisual, context: CanvasRenderingContext2D) => this.effect(context), this.identifier);
        }
    }

    effect(context: CanvasRenderingContext2D) {
        let alpha = context.globalAlpha;
        context.globalAlpha = this.alpha;
        context.drawImage(this.image, 0, 0);
        context.globalAlpha = alpha;
    }
}