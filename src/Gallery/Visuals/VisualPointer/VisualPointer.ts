import { GameVisual } from "../../../Engine/Game/GameObject/GameVisual";
import { GameView } from "../../../Engine/Game/GameObject/GameView";
import { Graphics } from "../../../Engine/Drawing/Graphics";
import { InputEvents } from "../../../Engine/Inputs/Inputs";
import { Vector2 } from "../../../Engine/Numerics/Vector2";

export class VisualPointer extends GameVisual {
    pointers: Vector2[] = [];
    cache: { container?: HTMLElement, cursor?: string, handler?: Function } = {};
    maxLength: number = 30;

    constructor() {
        super();
        this.joint(new VisualPointerView());
    }

    start(source: GameVisual) {
        this.cache.container = source.world.ui.container;
        this.cache.cursor = this.cache.container.style.cursor;
        this.cache.container.style.cursor = "none";
        this.cache.handler = () => {
            this.pointers.push(source.world.inputs.pointer.position.clone());
            if (this.pointers.length > this.maxLength) {
                this.pointers.shift();
            }
        };
        source.on(InputEvents.PointerMoved, this.cache.handler);
    }

    update() {
        if (this.pointers.length > 1) {
            this.pointers.shift();
        }
    }

    dispose(source?: GameVisual) {
        super.dispose();
        this.cache.container.style.cursor = this.cache.cursor;
        source && source.off(InputEvents.PointerMoved, this.cache.handler);
    }
}

export class VisualPointerView extends GameView {
    render(source: any, context: CanvasRenderingContext2D) {
        Graphics.hold(context, () => {
            if (source.pointers.length > 0) {
                context.beginPath();
                source.pointers.forEach((p: Vector2) => {
                    context.lineTo(p.x, p.y);
                });
                context.closePath();

                context.lineWidth = 10;
                context.lineCap = "round";
                context.lineJoin = "round";

                context.strokeStyle = "#FFF";
                context.stroke();
            }
        });
    }
}