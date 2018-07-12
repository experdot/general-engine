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
        this.ghost = this.joint(new GhostEffect(new Color(0, 0, 0, 0.01), 40, false));
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

        let stroke = this.stroke.white;
        let fill = this.fill.white;

        this.styles = [
            [stroke, null, false, false],
            [stroke, fill, false, true],
            [null, this.fill.blank, false, false],
            [null, null, true, true],
            [this.stroke.black, null, false, false],
            [stroke, null, false, true],
        ];

        this.joint(new DynamicLayerView());
        this.joint(new StaticLayerView());
    }

    render(source) {
        this.target = source;
    }

    drawAll(context, size, dynamic = true) {
        const radius = 50;
        const split = this.target.blockGrid.width;
        const height = this.target.blockGrid.height;
        const offset = (Math.min(size.width, size.height) * 0.8 - radius * 2) / height / 2;
        const blockBorder = 0;
        const blockHeight = offset + blockBorder;
        const yOffset = 1 - this.target.settings.progress;

        let allBlocks = this.target.blockGrid.allBlocks;
        let preBlocks = this.target.blockGrid.preBlocks;
        let fixBlocks = this.target.blockGrid;
        let current = this.target.blockGrid.current.getBlocks();
        let next = this.target.blockGrid.next.getBlocks();

        let args = {
            center: size.center,
            radius,
            blockHeight,
            blockBorder,
            yOffset: 0,
            split
        };

        if (dynamic) {
            this.drawBlocks(context, allBlocks, args, this.styles[0]);
            this.drawBlocks(context, fixBlocks, args, this.styles[1]);
            this.drawBlocks(context, preBlocks, args, this.styles[2]);
            args.yOffset = 4;
            this.drawBlocks(context, next, args, this.styles[3]);
            args.yOffset = 0;
        } else {
            this.drawBlocks(context, fixBlocks, args, this.styles[4]);
            args.yOffset = yOffset;
            this.drawBlocks(context, current, args, this.styles[5]);
            args.yOffset = 0;
        }
    }

    drawBlocks(context, blocks, args, style) {
        let angle = Math.PI / args.split;
        let actualHeight = args.blockHeight - args.blockBorder;
        blocks.forEach(block => {
            if (block) {
                let x = block.location.x;
                let y = block.location.y + args.yOffset;
                let base = x * angle * 2;
                let start = base - angle + this.target.settings.rotation;
                let end = base + angle + this.target.settings.rotation;
                let actualStroke = style[2] ? block.color : style[0];
                let actualFill = style[3] ? block.color : style[1];
                let singleArgs = {
                    center: args.center,
                    radius: args.radius + y * args.blockHeight,
                    height: actualHeight,
                    start,
                    end
                };
                this.drawSingle(context, singleArgs, actualStroke, actualFill);
            }
        });
    }

    drawSingle(context, args, stroke, fill) {
        context.beginPath();
        context.arc(args.center.x, args.center.y, args.radius, args.start, args.end, false);
        context.arc(args.center.x, args.center.y, args.radius + args.height, args.end, args.start, true);
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

    render(source, context) {
        if (!this.innerCanvas) {
            this.innerCanvas = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        let size = source.target.world.size;
        this.innerCanvas.draw(innerContext => {
            this.drawDynamic(source, innerContext, size);
        }).output(context, 0, 0);
    }

    drawDynamic(source, context, size) {
        source.target.ghost.effect(context);
        Graphics.scaleOffset(context, 8, 8 * context.canvas.height / context.canvas.width, 0.99);
        source.drawAll(context, size);
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

    render(source, context) {
        let size = source.target.world.size;
        this.drawStatic(source, context, size);
    }

    drawStatic(source, context, size) {
        if (source.target.settings.playing) {
            source.drawAll(context, size, false);
            this.drawScore(context, size, source.target.settings.score);
        } else {
            this.drawMask(context, size);
            if (source.target.settings.gameover) {
                this.drawTitle(context, size, "Game Over");
            } else {
                this.drawTitle(context, size, "Endless Abyss");
            }
            this.drawNotify(context, size);
        }
    }

    drawMask(context, size) {
        context.fillStyle = this.fill.mask.rgba;
        context.fillRect(0, 0, size.width, size.height);
    }

    drawTitle(context, size, title) {
        let fonSize = Math.max(size.width / 20, 48);
        context.font = fonSize + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText(title, size.center.x, size.center.y);
    }

    drawNotify(context, size) {
        let fonSize = Math.max(size.width / 48, 24);
        context.font = fonSize + "px Arial";
        context.textAlign = "center";
        this.single += 0.06;
        context.fillStyle = new Color(255, 255, 255, 0.6 + Math.sin(this.single) * 0.3).rgba;
        context.fillText("Press enter key to start", size.center.x, size.center.y + fonSize * 1.6);
    }

    drawScore(context, size, score) {
        let fonSize = Math.max(size.width / 48, 24);
        context.font = fonSize + "px Arial";
        context.textAlign = "right";
        context.fillStyle = new Color(255, 255, 255, 0.9).rgba;
        context.fillText("Score:" + score, size.width * 0.9, size.height * 0.15);
    }
}


export {
    EndlessAbyss,
    EndlessAbyssView
};