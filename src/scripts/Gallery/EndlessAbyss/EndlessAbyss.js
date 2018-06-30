import {
    GameVisual
} from "../../Engine/Game/GameObject/GameVisual";

import {
    Vector2
} from "../../Engine/Numerics/Vector2";
import {
    Color
} from "../../Engine/UI/Color";
import {
    EventHelper
} from "../../Engine/Utilities/EventHelper";
import {
    GameView
} from "../../Engine/Game/GameObject/GameView";
import {
    BlockGrid
} from "./Models/BlockGrid";

class EndlessAbyss extends GameVisual {
    constructor(view) {
        super(view);
        this.start.next(this._start);
        this.update.next(this._update);

        this.blockGrid = new BlockGrid(10, 20);

        this.rotation = 0;
    }

    _start() {
        let w = this.world.width;
        let h = this.world.height;

        this.center = new Vector2(w / 2, h / 2);

        this.fillColor = new Color(0, 0, 0, 1);
        this.view.render.next(context => {
            context.fillStyle = this.fillColor.rgba;
            context.fillRect(0, 0, w, h);
        }, 0);

        this._registEvents();

        this.lastTime = new Date().getTime();
    }
    _update() {
        // if (Math.random() > 0.5) {
        //     this.fillColor = ColorHelper.getGradientRandomColor(this.fillColor, 10);
        // }

        let current = new Date().getTime();
        if (current - this.lastTime > 500) {
            this.lastTime = current;
            this.blockGrid.down();
        }
    }
    _registEvents() {
        this.on("KeyPress", (event) => {
            if (event.key === "a") {
                this.blockGrid.left();
            } else if (event.key === "d") {
                this.blockGrid.right();
            } else if (event.key === "w") {
                this.blockGrid.up();
            } else if (event.key === "s") {
                this.blockGrid.down();
            }
        });

        this.on("PointerPressed", (event) => {
            this.isPressed = true;
            this.startPointer = EventHelper.getEventClientPositon(event);
            this.startRotation = this.rotation;
            this.moveCount = 0;
        });

        this.on("PointerReleased", () => {
            this.isPressed = false;
        });

        this.on("PointerMoved", (event) => {
            if (this.isPressed) {
                let end = EventHelper.getEventClientPositon(event);
                let offset = end.subtract(this.startPointer);
                let normal = this.startPointer.subtract(this.center).rotate(Math.PI / 2).normalize();
                let strength = offset.dot(normal) / 100;
                this.rotation = this.startRotation + strength;
                this.end = end;
                this.moveCount += 1;
                if (this.moveCount > 8) {
                    this.startPointer = EventHelper.getEventClientPositon(event);
                    this.startRotation = this.rotation;
                    this.moveCount = 0;
                }
            }
        });
    }
}

class EndlessAbyssView extends GameView {
    constructor(target) {
        super(target);
        this.fillColor = new Color(255, 255, 255);
        this.strokeColor = new Color(255, 255, 255, 0.2);
    }

    draw(context) {
        let w = this.target.world.width;
        let h = this.target.world.height;

        const radius = 50;
        const split = this.target.blockGrid.width;
        const height = this.target.blockGrid.height;
        const offset = (Math.min(w, h) * 0.8 - radius * 2) / height / 2;
        const border = 0;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < split; j++) {
                this.drawArc(context, w / 2, h / 2, radius + i * (offset + border), offset, j, split, this.strokeColor);
            }
        }

        this.target.blockGrid.forEach((block, x, y) => {
            if (block) {
                this.drawArc(context, w / 2, h / 2, radius + y * (offset + border), offset, x, split, block.color, false);
            }
        });

        this.target.blockGrid.current.getBlocks().forEach(block => {
            if (block) {
                let x = block.location.x;
                let y = block.location.y;
                this.drawArc(context, w / 2, h / 2, radius + y * (offset + border), offset, x, split, this.fillColor, false);
            }
        });

        this.target.blockGrid.next.getBlocks().forEach(block => {
            if (block) {
                let x = block.location.x;
                let y = block.location.y + 4;
                this.drawArc(context, w / 2, h / 2, radius + y * (offset + border), offset, x, split, this.fillColor, false);
            }
        });
    }

    drawArc(context, x, y, radius, offset, rotate = 0, split = 10, color, stroke = true) {
        let angle = Math.PI / split;
        let offangle = 0.0;
        let start = rotate * angle * 2 - angle + offangle + this.target.rotation;
        let end = rotate * angle * 2 + angle - offangle + this.target.rotation;
        context.beginPath();
        context.arc(x, y, radius, start, end, false);
        context.arc(x, y, radius + offset, end, start, true);
        context.closePath();
        if (stroke) {
            context.strokeStyle = color.rgba;
            context.stroke();
        } else {
            context.fillStyle = color.rgba;
            context.fill();
            context.strokeStyle = color.rgba;
            context.stroke();
        }
    }
}

export {
    EndlessAbyss,
    EndlessAbyssView
};