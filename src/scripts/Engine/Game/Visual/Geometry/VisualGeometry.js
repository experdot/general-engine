import {
    GameVisual
} from "../../GameObject/GameVisual";
import {
    GameView
} from "../../GameObject/GameView";

class VisualGeometry extends GameVisual {
    constructor(view) {
        super(view);
        this.vertices = [];
        this.isClosed = false;
        this.fillStyle = {
            color: "black",
            isEnabled: false
        };
        this.borderStyle = {
            color: "black",
            width: 1,
            isEnabled: true
        };
    }
}

class GeometryView extends GameView {
    draw(context) {
        var v = this.target.vertices;
        var len = this.target.vertices.length;
        if (len > 0) {
            context.beginPath();
            context.moveTo(v[0].x, v[0].y);
            this.target.vertices.forEach(element => {
                context.lineTo(element.x, element.y);
            });
            if (this.target.isClosed) {
                context.lineTo(v[0].x, v[0].y);
            }
        }
    }
    afterDraw(context) {
        // fill content
        if (this.target.fillStyle.isEnabled) {
            context.fillStyle = this.target.fillStyle.color;
            context.fill();
        }
        // draw border
        if (this.target.borderStyle.isEnabled) {
            context.strokeStyle = this.target.borderStyle.color;
            context.stroke();
        }
    }
}

export {
    VisualGeometry,
    GeometryView
};