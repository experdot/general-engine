import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";
import {
    GameView
} from "../../../Engine/Game/GameObject/GameView";
import {
    Graphics
} from "../../../Engine/Drawing/Graphics";
class VisualPointer extends GameVisual {
    constructor() {
        super();
        this.pointers = [];
        this.joint(new VisualPointerView());
    }

    start(source) {
        let container = source.world.ui.container;
        this.cursor = container.style.cursor;
        container.style.cursor = "none";
        source.on("PointerMoved", () => {
            this.pointers.push(source.world.inputs.pointer.position.clone());
        });
    }

    update() {
        if (this.pointers.length > 1) {
            this.pointers.shift();
        }
    }

    dispose(source) {
        super.dispose();
        source.world.ui.container.style.cursor = this.cursor;
    }
}

class VisualPointerView extends GameView {
    render(source, context) {
        Graphics.hold(context, () => {
            if (source.pointers.length > 0) {
                context.beginPath();
                source.pointers.forEach(p => {
                    context.lineTo(p.x, p.y);
                });
                context.lineWidth = 10;
                context.strokeStyle = "#FFF";
                context.stroke();
            }
        });
    }
}

export {
    VisualPointer
};