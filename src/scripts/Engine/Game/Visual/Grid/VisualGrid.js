import {
    Vector2
} from "../../../Engine/Numerics/Vector2";
import {
    GameView
} from "../../GameObject/GameView";

class GridView extends GameView {
    draw(context) {
        let width = this.target.world.width;
        let height = this.target.world.height;
        let size = this.target.cellSize;
        for (var i = 0; i <= width; i += size.x) {
            this.drawLine(context, new Vector2(i, 0), new Vector2(i, height));
        }
        for (var j = 0; j <= this.target.world.height; j += size.y) {
            this.drawLine(context, new Vector2(0, j), new Vector2(width, j));
        }
    }

    afterDraw(context) {
        context.strokeStyle = "#EEEEEE";
        context.stroke();
    }

    drawLine(context, v1, v2) {
        context.moveTo(v1.x, v1.y);
        context.lineTo(v2.x, v2.y);
    }
}

export {
    GridView
};