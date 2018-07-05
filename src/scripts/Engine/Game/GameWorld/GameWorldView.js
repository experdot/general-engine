import {
    GameView
} from "../GameObject/GameView";
import {
    Colors
} from "../../../Engine/UI/Color";

class GameWorldView extends GameView {
    constructor() {
        super();
        this.isClear = false;
        this.clearColor = Colors.Black;
    }

    draw(source, context) {
        this.checkInnerCanvas();

        context.clearRect(0, 0, this.target.width, this.target.height);

        if (this.isClear) {
            this.innerContext.fillStyle = this.clearColor.rgba;
            this.innerContext.fillRect(0, 0, this.target.width, this.target.height);
        }
        this.target.visuals.forEach(element => {
            element.view && element.view.render.process(this.innerContext);
        });

        context.drawImage(this.innerCanvas, 0, 0);
    }

    checkInnerCanvas() {
        if (!this.innerContext) {
            this.innerCanvas = document.createElement("canvas");
            this.innerContext = this.innerCanvas.getContext("2d");
            this.innerCanvas.width = this.target.width;
            this.innerCanvas.height = this.target.height;
        }
    }
}

export {
    GameWorldView
};