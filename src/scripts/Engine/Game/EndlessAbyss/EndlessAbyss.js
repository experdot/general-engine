import {
    GameView
} from "../../Core/GameObject/GameView";
import {
    GameVisual
} from "../../Core/GameObject/GameVisual";
import {
    Color,
    ColorHelper
} from "../../../Fundamental/Color";
import {
    BlockGrid
} from "./Models/BlockGrid";
import {
    Block
} from "./Models/Block/Block";
import {
    Vector2
} from "../../../Fundamental/Vector";
import {
    BlockGroupHelper
} from "./Models/BlockGroup";
import {
    EventHelper
} from "../../Core/Utilities/EventHelper";

class EndlessAbyss extends GameVisual {
    constructor(view) {
        super(view);
        this.start.next(this._start);
        this.update.next(this._update);

        this.blocks = new BlockGrid(12, 20);

        this.blockGroups = BlockGroupHelper.getStandardGroups();

        this.blockGroups[0].move(new Vector2(4, 4)).getLocations().forEach(element => {
            this.blocks.setCell(element.x, element.y, new Block().setLocation(element).setColor(new Color(0, 255, 0)));
        });

        this.blockGroups[0].move(new Vector2(4, 4)).rotate().getLocations().forEach(element => {
            this.blocks.setCell(element.x, element.y, new Block().setLocation(element).setColor(new Color(0, 255, 0)));
        });

        this.rotation = 0;
    }

    _start() {
        let w = this.world.width;
        let h = this.world.height;

        this.center = new Vector2(w / 2, h / 2);

        this.fillColor = new Color(0, 128, 128, 0.1);
        this.view.render.next(context => {
            context.fillStyle = this.fillColor.getRGBAValue();
            context.fillRect(0, 0, w, h);
        }, 0);

        this._registEvents();
    }
    _update() {
        if (Math.random() > 0.5) {
            this.fillColor = ColorHelper.getGradientRandomColor(this.fillColor, 10);
        }
    }

    _registEvents() {
        this.eventSystem.addHandler("onPointerPressed", (event) => {
            this.isPressed = true;
            this.startPointer = EventHelper.getEventClientPositon(event);
            this.startRotation = this.rotation;
            this.count = 0;
        }, true);

        this.eventSystem.addHandler("onPointerReleased", () => {
            this.isPressed = false;
        }, true);

        this.eventSystem.addHandler("onPointerMove", (event) => {
            if (this.isPressed) {
                let end = EventHelper.getEventClientPositon(event);
                let offset = end.subtract(this.startPointer);
                let normal = this.startPointer.subtract(this.center).rotate(Math.PI / 2).normalize();
                let strength = offset.dot(normal) / 80;
                this.rotation = this.startRotation + strength;
                this.end = end;
                this.count += 1;
                if (this.count > 8) {
                    this.startPointer = EventHelper.getEventClientPositon(event);
                    this.startRotation = this.rotation;
                    this.count = 0;
                }
            }
        }, true);
    }
}

class EndlessAbyssView extends GameView {
    draw(context) {
        let w = this.target.world.width;
        let h = this.target.world.height;

        const radius = 50;
        const split = this.target.blocks.width;
        const height = this.target.blocks.height;
        const offset = (Math.min(w, h) * 0.8 - radius * 2) / height / 2;
        const border = 0;

        this.fillColor = new Color(255, 255, 255);
        this.strokeColor = new Color(255, 255, 255, 0.1);

        this.target.blocks.forEach((block, x, y) => {
            if (block) {
                this.drawArc(context, w / 2, h / 2, radius + y * (offset + border), offset, x, split, false);
            }
        });

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < split; j++) {
                this.drawArc(context, w / 2, h / 2, radius + i * (offset + border), offset, j, split);
            }
        }
    }

    drawArc(context, x, y, radius, offset, rotate = 0, split = 10, stroke = true) {
        let angle = Math.PI / split;
        let offangle = 0.0;
        let start = rotate * angle * 2 - angle + offangle + this.target.rotation;
        let end = rotate * angle * 2 + angle - offangle + this.target.rotation;
        context.beginPath();
        context.arc(x, y, radius, start, end, false);
        context.arc(x, y, radius + offset, end, start, true);
        context.closePath();
        if (stroke) {
            context.strokeStyle = this.strokeColor.getRGBAValue();
            context.stroke();
        } else {
            context.fillStyle = this.fillColor.getRGBAValue();
            context.fill();
        }
    }
}

export {
    EndlessAbyss,
    EndlessAbyssView
};