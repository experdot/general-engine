import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";

import {
    Vector2
} from "../../../Engine/Numerics/Vector2";
import {
    Color
} from "../../../Engine/UI/Color";
import {
    EventHelper
} from "../../../Engine/Utilities/EventHelper";
import {
    GameView
} from "../../../Engine/Game/GameObject/GameView";
import {
    BlockGrid
} from "./Models/BlockGrid";
import {
    GhostEffect
} from "../../../Engine/Game/GameComponents/Effect/Effect";
import {
    DelayTimer
} from "../../../Engine/Common/DelayTimer";
import {
    Graphics
} from "../../../Engine/Drawing/Graphics";
import {
    OffscreenCanvas
} from "../../../Engine/Drawing/OffscreenCanvas";

class EndlessAbyss extends GameVisual {
    constructor(view) {
        super(view);
        this.timer = new DelayTimer();
        this.ghost = this.proxy(new GhostEffect(new Color(0, 0, 0, 0.01), 40, false));
    }

    start() {
        let w = this.world.width;
        let h = this.world.height;

        this.settings = {
            width: 10,
            rotation: 0,
            center: new Vector2(w / 2, h / 2),
            playing: false,
            gameover: false,
            score: 0,
            progress: 0,
            delayTime: 500,
            pointer: {
                position: new Vector2(),
                rotation: 0,
                count: 0
            }
        };

        this.blockGrid = new BlockGrid(this.settings.width, 20);
        this._registEvents();
    }

    update() {
        if (this.settings.playing) {
            this.timer.delay(this.settings.delayTime, () => {
                this.blockGrid.down();
                this.settings.progress = 0;
            }, (actual) => {
                this.settings.progress = actual / this.settings.delayTime;
            });
        }
        this.settings.rotation += 0.002;
    }
    
    _registEvents() {
        this.on("KeyPress", (event) => {
            if (!this.settings.playing) {
                if (event.key === "Enter") {
                    this.settings.playing = true;
                    if (this.settings.gameover) {
                        this.settings.gameover = false;
                        this.blockGrid.reset();
                    }
                }
                return;
            }
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
            let pointer = this.settings.pointer;
            pointer.position = EventHelper.getEventClientPositon(event);
            pointer.rotation = this.settings.rotation;
            pointer.count = 0;
        });

        this.on("PointerMoved", (event) => {
            if (this.world.inputs.pointer.isPressed) {
                let pointer = this.settings.pointer;
                let end = EventHelper.getEventClientPositon(event);
                let offset = end.subtract(pointer.position);
                let normal = pointer.position.subtract(this.settings.center).rotate(Math.PI / 2).normalize();
                let strength = offset.dot(normal) / 100;
                this.settings.rotation = pointer.rotation + strength;
                pointer.count += 1;
                if (pointer.count > 8) {
                    pointer.position = EventHelper.getEventClientPositon(event);
                    pointer.rotation = this.settings.rotation;
                    pointer.count = 0;
                }
            }
        });

        this.blockGrid.onOver = () => {
            this.settings.playing = false;
            this.settings.gameover = true;
            this.settings.score = 0;
        };

        this.blockGrid.onFullRow = (count) => {
            this.settings.score += 10 * Math.pow(2, count - 1);
        };
    }
}

class EndlessAbyssView extends GameView {
    constructor() {
        super();

        this.fill = {
            white: new Color(255, 255, 255, 0.05),
            blank: new Color(255, 255, 255, 0.05),
            mask: new Color(0, 0, 0, 0.6)
        };
        this.stroke = {
            white: new Color(255, 255, 255, 0.05),
            black: new Color(0, 0, 0, 0.2),
        };

        this.proxy(new DynamicLayerView());
        this.proxy(new StaticLayerView());
    }

    drawAll(context, w, h, cx, cy, dynamic = true) {
        const radius = 50;
        const split = this.target.blockGrid.width;
        const height = this.target.blockGrid.height;
        const offset = (Math.min(w, h) * 0.8 - radius * 2) / height / 2;
        const blockBorder = 0;
        const blockHeight = offset + blockBorder;
        const yOffset = 1 - this.target.settings.progress;

        let allBlocks = this.target.blockGrid.allBlocks;
        let preBlocks = this.target.blockGrid.preBlocks;
        let fixBlocks = this.target.blockGrid;
        let current = this.target.blockGrid.current.getBlocks();
        let next = this.target.blockGrid.next.getBlocks();
        let stroke = this.stroke.white;
        let fill = this.fill.white;

        if (dynamic) {
            this.drawBlocks(context, allBlocks, cx, cy, radius, blockHeight, blockBorder, 0, split, stroke, null);
            this.drawBlocks(context, fixBlocks, cx, cy, radius, blockHeight, blockBorder, 0, split, stroke, fill, false, true);
            this.drawBlocks(context, preBlocks, cx, cy, radius, blockHeight, blockBorder, 0, split, null, this.fill.blank);
            this.drawBlocks(context, next, cx, cy, radius, blockHeight, blockBorder, 4, split, null, null, true, true);
        } else {
            stroke = this.stroke.black;
            this.drawBlocks(context, fixBlocks, cx, cy, radius, blockHeight, blockBorder, 0, split, stroke, null);
            this.drawBlocks(context, current, cx, cy, radius, blockHeight, blockBorder, yOffset, split, stroke, null, false, true);
        }
    }

    drawBlocks(context, blocks, cx, cy, radius, blockHeight, blockBorder, yOffset, split, stroke, fill, strokeRaw, fillRaw) {
        let angle = Math.PI / split;
        let actualHeight = blockHeight - blockBorder;
        blocks.forEach(block => {
            if (block) {
                let x = block.location.x;
                let y = block.location.y + yOffset;
                let base = x * angle * 2;
                let start = base - angle + this.target.settings.rotation;
                let end = base + angle + this.target.settings.rotation;
                let actualStroke = strokeRaw ? block.color : stroke;
                let actualFill = fillRaw ? block.color : fill;
                this.drawSingle(context, cx, cy, radius + y * blockHeight, actualHeight, start, end, actualStroke, actualFill);
            }
        });
    }

    drawSingle(context, cx, cy, radius, height, start, end, stroke, fill) {
        context.beginPath();
        context.arc(cx, cy, radius, start, end, false);
        context.arc(cx, cy, radius + height, end, start, true);
        context.closePath();
        if (stroke) {
            context.strokeStyle = stroke.rgba;
            context.stroke();
        }
        if (fill) {
            context.fillStyle = fill.rgba;
            context.fill();
        }
    }
}


class DynamicLayerView extends GameView {
    constructor() {
        super();
    }

    draw(source, context) {
        if (!this.innerCanvas) {
            this.innerCanvas = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }
        let w = source.target.world.width;
        let h = source.target.world.height;
        let cx = w / 2;
        let cy = h / 2;
        this.innerCanvas.draw(innerContext => {
            this.drawDynamic(source, innerContext, w, h, cx, cy);
        }).output(context, 0, 0);
    }

    drawDynamic(source, context, w, h, cx, cy) {
        source.target.ghost.effect(context);
        Graphics.offsetScale(context, 8, 8 * context.canvas.height / context.canvas.width, 0.99);
        source.drawAll(context, w, h, cx, cy);
    }

}

class StaticLayerView extends GameView {
    constructor() {
        super();
        this.single = 0;
        this.fill = {
            mask: new Color(0, 0, 0, 0.6)
        };
    }

    draw(source, context) {
        let w = source.target.world.width;
        let h = source.target.world.height;
        let cx = w / 2;
        let cy = h / 2;
        this.drawStatic(source, context, w, h, cx, cy);
    }

    drawStatic(source, context, w, h, cx, cy) {
        if (source.target.settings.playing) {
            source.drawAll(context, w, h, cx, cy, false);
            this.drawScore(context, w, h, source.target.settings.score);
        } else {
            this.drawMask(context, w, h);
            if (source.target.settings.gameover) {
                this.drawTitle(context, w, h, cx, cy, "Game Over");
            } else {
                this.drawTitle(context, w, h, cx, cy, "Endless Abyss");
            }
            this.drawNotify(context, w, h, cx, cy);
        }
    }

    drawMask(context, w, h) {
        context.fillStyle = this.fill.mask.rgba;
        context.fillRect(0, 0, w, h);
    }

    drawTitle(context, w, h, cx, cy, title) {
        let size = Math.max(w / 20, 48);
        context.font = size + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText(title, cx, cy);
    }

    drawNotify(context, w, h, cx, cy) {
        let size = Math.max(w / 48, 24);
        context.font = size + "px Arial";
        context.textAlign = "center";
        this.single += 0.06;
        context.fillStyle = new Color(255, 255, 255, 0.6 + Math.sin(this.single) * 0.3).rgba;
        context.fillText("Press enter key to start", cx, cy + size * 1.6);
    }

    drawScore(context, w, h, score) {
        let size = Math.max(w / 48, 24);
        context.font = size + "px Arial";
        context.textAlign = "right";
        context.fillStyle = new Color(255, 255, 255, 0.9).rgba;
        context.fillText("Score:" + score, w * 0.9, h * 0.15);
    }
}

export {
    EndlessAbyss,
    EndlessAbyssView
};