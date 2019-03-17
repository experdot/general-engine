import {
    Vector2
} from "../../../Engine/Numerics/Vector2";
import {
    GameView
} from "../../../Engine/Game/GameObject/GameView";

class GridView extends GameView {
    constructor() {
        super();
        this.size = {
            x: 32,
            y: 32
        };
    }

    render(source: any, context: CanvasRenderingContext2D) {
        let width = source.world.width;
        let height = source.world.height;

        for (var i = 0; i <= width; i += this.size.x) {
            this.drawLine(context, new Vector2(i, 0), new Vector2(i, height));
        }
        for (var j = 0; j <= source.world.height; j += this.size.y) {
            this.drawLine(context, new Vector2(0, j), new Vector2(width, j));
        }
    }

    drawLine(context: CanvasRenderingContext2D, v1: Vector2, v2: Vector2) {
        context.beginPath();
        context.moveTo(v1.x, v1.y);
        context.lineTo(v2.x, v2.y);
        context.closePath();
        context.strokeStyle = "rgba(255,255,255,0.5)";
        context.stroke();
    }
}

export {
    GridView
};