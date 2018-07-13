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
        this.cache = {};
        this.joint(new VisualPointerView());
    }

    start(source) {
        this.cache.container = source.world.ui.container;
        this.cache.cursor = this.cache.container.style.cursor;
        this.cache.container.style.cursor = "none";
        this.cache.handler = () => {
            this.pointers.push(source.world.inputs.pointer.position.clone());
        };
        source.on("PointerMoved", this.cache.handler);
    }

    update() {
        if (this.pointers.length > 1) {
            this.pointers.shift();
        }
    }

    dispose(source) {
        super.dispose();
        this.cache.container.style.cursor = this.cache.cursor;
        source.off("PointerMoved", this.cache.handler);
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