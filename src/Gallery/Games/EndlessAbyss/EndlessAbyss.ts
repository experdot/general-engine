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
import {
    InputEvents
} from "../../../Engine/Inputs/Inputs";
import {
    GalleryTexts
} from "../../Resources/GalleryTexts";
import { Random } from "../../../Engine/Numerics/Random";
import { Keys } from "../../../Engine/Common/Keys";
import { GameWorld } from "../../../Engine/Game/GameWorld/GameWorld";

interface EndlessAbyssSettings {
    width: number;
    height: number;
    rotation: number;
    center: Vector2;
    delayTime: number;
    pointer: any;
}

interface GameStatus {
    playing: boolean;
    gameover: boolean;
    mocking: boolean;
    score: number;
    progress: number;
}

export class EndlessAbyss extends GameVisual {
    status: GameStatus;
    settings: EndlessAbyssSettings;

    grid: BlockGrid;

    ghost: GhostEffect;

    private timer: DelayTimer;

    constructor() {
        super();
        this.timer = new DelayTimer();
        this.ghost = new GhostEffect(new Color(0, 0, 0, 0.005), 30, false);
        this.joint(this.ghost);
    }

    start() {
        this.initProperties();
        this.grid = new BlockGrid(this.settings.width, this.settings.height);
        this.registEvents();
    }

    update() {
        if (this.status.playing || this.status.mocking) {
            let delay = this.status.mocking ? 200 : this.settings.delayTime;
            this.timer.delay(delay, () => {
                this.grid.down();
                this.status.progress = 0;
            }, (actual: number) => {
                this.status.progress = actual / delay;
            });
        }
        this.settings.rotation += 0.002;
    }

    private initProperties() {
        const w = this.world.width;
        const h = this.world.height;

        this.status = {
            playing: false,
            gameover: false,
            mocking: true,
            score: 0,
            progress: 0,
        }

        this.settings = {
            width: new Random().range(10, 30),
            height: 20,
            rotation: 0,
            center: new Vector2(w / 2, h / 2),
            delayTime: 500,
            pointer: {
                position: new Vector2(),
                rotation: 0,
                count: 0
            }
        };
    }

    private registEvents() {
        this.registKeyPressedEvent();
        this.registPointerEvents();
        this.registBlockGridEvents();
    }

    private registKeyPressedEvent() {
        this.on(InputEvents.KeyPress, (event: KeyboardEvent) => {
            if (!this.status.playing) {
                if (event.keyCode === Keys.Enter) {
                    this.status.playing = true;
                    if (this.status.gameover) {
                        this.status.gameover = false;
                    }
                    if (this.status.mocking) {
                        this.status.mocking = false;
                    }
                    this.grid.reset();
                }
                return;
            }

            if (event.key === "a") {
                this.grid.left();
            } else if (event.key === "d") {
                this.grid.right();
            } else if (event.key === "w") {
                this.grid.up();
            } else if (event.key === "s") {
                this.grid.down();
            }
        });
    }

    private registPointerEvents() {
        this.on(InputEvents.PointerPressed, (event: MouseEvent | TouchEvent) => {
            const pointer = this.settings.pointer;
            pointer.position = EventHelper.getEventClientPositon(event);
            pointer.rotation = this.settings.rotation;
            pointer.count = 0;
        });

        this.on(InputEvents.PointerMoved, (event: MouseEvent | TouchEvent) => {
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
    }

    private registBlockGridEvents() {
        this.grid.onOver = () => {
            if (this.status.mocking) {
                this.status.playing = false;
                this.status.mocking = true;
                this.status.gameover = false;
                this.grid.reset();
            }
            else {
                this.status.playing = false;
                this.status.mocking = false;
                this.status.gameover = true;
            }
            this.status.score = 0;
        };

        this.grid.onFullRow = (count: number) => {
            this.status.score += 10 * Math.pow(2, count - 1);
        };
    }
}

interface FillColors {
    white: Color;
    blank: Color;
    mask: Color;
}

interface StrokeColors {
    white: Color;
    black: Color;
}

interface DrawingArgs {
    center: Vector2;
    radius: number;
    blockHeight: number;
    blockBorder: number;
    yOffset: number;
    split: number;
}

interface SingleArgs {
    center: Vector2;
    radius: number;
    height: number;
    start: number;
    end: number;
    stroke?: Color;
    fill?: Color;
}

class ColorMode {
    stroke?: Color;
    fill?: Color;
    ignoreStroke?: boolean;
    ignoreFill?: boolean;

    constructor(stroke: Color, fill: Color, ignoreStroke: boolean, ignoreFill: boolean) {
        this.stroke = stroke;
        this.fill = fill;
        this.ignoreStroke = ignoreStroke;
        this.ignoreFill = ignoreFill;
    }
}

interface ViewSettings {
    radius: number;
    border: number;
}


export class EndlessAbyssView extends GameView {
    target: EndlessAbyss;

    fill: FillColors;
    stroke: StrokeColors;

    colorModes: ColorMode[] = [];

    settings: ViewSettings;

    single: number = 0;

    constructor() {
        super();

        this.initProperties();

        this.joint(new DynamicLayerView());
        this.joint(new StaticLayerView());
    }

    render(source: any) {
        this.target = source;

        this.single = (this.single + 0.01) % (Math.PI * 2);
        this.settings.radius = 100 + 75 * Math.sin(this.single);

        //this.settings.border = 10 + 10 * Math.sin(this.single);
    }

    drawAll(context: CanvasRenderingContext2D, size: any, dynamic = true, ignoreFix = false) {
        const radius = this.settings.radius;
        const split = this.target.grid.width;
        const height = this.target.grid.height;
        const offset = (Math.min(size.width, size.height) * 0.8 - radius * 2) / height / 2;
        const blockBorder = this.settings.border;
        const blockHeight = offset + blockBorder;
        const yOffset = 1 - this.target.status.progress;

        const allBlocks = this.target.grid.allBlocks;
        const preBlocks = this.target.grid.preBlocks;
        const fixBlocks = this.target.grid;
        const current = this.target.grid.current.getBlocks();
        const next = this.target.grid.next.getBlocks();

        const args: DrawingArgs = {
            center: size.center,
            radius,
            blockHeight,
            blockBorder,
            yOffset: 0,
            split
        };

        if (dynamic) {
            this.drawBlocks(context, fixBlocks, args, this.colorModes[1]);
            this.drawBlocks(context, preBlocks, args, this.colorModes[2]);
            args.yOffset = 4;
            this.drawBlocks(context, next, args, this.colorModes[3]);
            args.yOffset = 0;
        } else {
            //this.drawBlocks(context, allBlocks, args, this.colorModes[0]);
            !ignoreFix && this.drawBlocks(context, fixBlocks, args, this.colorModes[4]);
            args.yOffset = yOffset;
            this.drawBlocks(context, current, args, this.colorModes[5]);
            args.yOffset = 0;
        }
    }

    drawBlocks(context: CanvasRenderingContext2D, blocks: any, args: DrawingArgs, style: ColorMode) {
        const angle = Math.PI / args.split;
        const actualHeight = args.blockHeight - args.blockBorder;
        blocks.forEach((block: any) => {
            if (block) {
                const x = block.location.x;
                const y = block.location.y + args.yOffset;
                const base = x * angle * 2;
                const start = base - angle + this.target.settings.rotation;
                const end = base + angle + this.target.settings.rotation;
                const actualStroke = style.ignoreStroke ? block.color : style.stroke;
                const actualFill = style.ignoreFill ? block.color : style.fill;
                const singleArgs: SingleArgs = {
                    center: args.center,
                    radius: args.radius + y * args.blockHeight,
                    height: actualHeight,
                    start,
                    end,
                    stroke: actualStroke,
                    fill: actualFill
                };
                this.drawSingleBlock(context, singleArgs);
            }
        });
    }

    drawSingleBlock(context: CanvasRenderingContext2D, args: SingleArgs) {
        context.beginPath();
        context.arc(args.center.x, args.center.y, args.radius, args.start, args.end, false);
        context.arc(args.center.x, args.center.y, args.radius + args.height, args.end, args.start, true);
        context.closePath();
        if (args.stroke) {
            context.strokeStyle = args.stroke.rgba;
            context.stroke();
        }
        if (args.fill) {
            context.fillStyle = args.fill.rgba;
            context.fill();
        }
    }

    private initProperties() {
        this.fill = {
            white: new Color(255, 255, 255, 0.05),
            blank: new Color(255, 255, 255, 0.05),
            mask: new Color(0, 0, 0, 0.6)
        };

        this.stroke = {
            white: new Color(255, 255, 255, 0.05),
            black: new Color(0, 0, 0, 0.2),
        };

        const stroke = this.stroke.white;
        const fill = this.fill.white;

        this.colorModes.push(
            new ColorMode(stroke, null, false, false),
            new ColorMode(stroke, fill, false, true),
            new ColorMode(null, this.fill.blank, false, false),
            new ColorMode(null, null, true, true),
            new ColorMode(this.stroke.black, null, false, false),
            new ColorMode(stroke, null, false, true),
        );

        this.settings = {
            radius: 50,
            border: 0
        }
    }
}


class DynamicLayerView extends GameView {
    layer: OffscreenCanvas;

    render(source: EndlessAbyssView, context: CanvasRenderingContext2D) {
        if (!this.layer) {
            this.layer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        const size = source.target.world.size;
        this.layer.draw((innerContext: CanvasRenderingContext2D) => {
            this.drawDynamic(source, innerContext, size);
        }).output(context, 0, 0);
    }

    private drawDynamic(source: EndlessAbyssView, context: CanvasRenderingContext2D, size: any) {
        source.target.ghost.effect(context);
        Graphics.scaleOffset(context, 8, 8 * context.canvas.height / context.canvas.width, 1);
        Graphics.rotate(context, Math.PI / 160, 1, () => {
            context.drawImage(context.canvas, 0, 0, context.canvas.width, context.canvas.height);
        });
        source.drawAll(context, size);
    }
}

class StaticLayerView extends GameView {
    mask: Color = new Color(0, 0, 0, 0.6);
    single: number = 0;

    render(source: EndlessAbyssView, context: CanvasRenderingContext2D) {
        const size = source.target.world.size;
        this.drawStatic(source, context, size);
    }

    private drawStatic(source: EndlessAbyssView, context: CanvasRenderingContext2D, size: any) {
        if (source.target.status.playing) {
            source.drawAll(context, size, false, false);
            this.drawScore(context, size, source.target.status.score);
        }
        if (source.target.status.mocking) {
            source.drawAll(context, size, false, true);
        }
        if (!source.target.status.playing) {
            this.drawMask(context, size);
            Graphics.shadow(context, 3, "rgba(0,0,0,0.38)", 3, 3, () => {
                if (source.target.status.gameover) {
                    this.drawTitle(context, size, GalleryTexts.EndlessAbyssWorld.GameOver);
                } else {
                    this.drawTitle(context, size, GalleryTexts.EndlessAbyssWorld.GameName);
                }
            });
            this.drawNotify(context, size);
        }
    }

    private drawMask(context: CanvasRenderingContext2D, size: any) {
        context.fillStyle = this.mask.rgba;
        context.fillRect(0, 0, size.width, size.height);
    }

    private drawTitle(context: CanvasRenderingContext2D, size: any, title: string) {
        let fonSize = Math.max(size.width / 20, 48);
        context.font = fonSize + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText(title, size.center.x, size.center.y);
    }

    private drawNotify(context: CanvasRenderingContext2D, size: any) {
        let fonSize = Math.max(size.width / 64, 16);
        context.font = fonSize + "px Arial";
        context.textAlign = "center";
        this.single += 0.06;
        context.fillStyle = new Color(255, 255, 255, 0.6 + Math.sin(this.single) * 0.3).rgba;
        context.fillText(GalleryTexts.EndlessAbyssWorld.Tip, size.center.x, size.center.y + fonSize * 1.6);
    }

    private drawScore(context: CanvasRenderingContext2D, size: any, score: number) {
        let fonSize = Math.max(size.width / 48, 24);
        context.font = fonSize + "px Arial";
        context.textAlign = "right";
        context.fillStyle = new Color(255, 255, 255, 0.9).rgba;
        context.fillText(GalleryTexts.EndlessAbyssWorld.Score + score, size.width * 0.9, size.height * 0.15);
    }
}