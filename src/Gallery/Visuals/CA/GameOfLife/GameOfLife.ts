import {
    GameVisual
} from "../../../../Engine/Game/GameObject/GameVisual";
import {
    GhostEffect
} from "../../../../Engine/Game/GameComponents/Effect/Effect";
import {
    Color,
    Colors
} from "../../../../Engine/UI/Color";
import {
    CellularAutomata
} from "../CellularAutomata";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    Cell
} from "../Cell";
import {
    GameView, TypedGameView
} from "../../../../Engine/Game/GameObject/GameView";
import {
    Graphics
} from "../../../../Engine/Drawing/Graphics";
import {
    DelayTimer
} from "../../../../Engine/Common/DelayTimer";
import {
    InputEvents
} from "../../../../Engine/Inputs/Inputs";

interface IGameOfLifeSettings {
    xOffsets: Array<number>;
    yOffsets: Array<number>;
    progress: number;
    sin: number;
    size: number;
    initialSize: number;
    rangeSize: number;
    rotation: number;
}

export class GameOfLife extends GameVisual {
    get offset() {
        if (this.settings && this.automata) {
            let size = this.settings.size;
            let initial = this.settings.initialSize;
            let xOffset = -(size - initial) * this.automata.width / 2;
            let yOffset = -(size - initial) * this.automata.height / 2;
            return new Vector2(xOffset, yOffset);
        }
        return null;
    }

    automata: CellularAutomata;
    settings: IGameOfLifeSettings;
    ghost: GhostEffect;

    private timers: { generate: DelayTimer; exchange: DelayTimer; grow: DelayTimer };

    constructor() {
        super();

        this.ghost = new GhostEffect(new Color(0, 0, 0, 0.05), 15);
        this.joint(this.ghost);

        this.timers = {
            generate: new DelayTimer(),
            exchange: new DelayTimer(),
            grow: new DelayTimer()
        };

        this.settings = {
            xOffsets: [-1, 0, 1, 1, 1, 0, -1, -1],
            yOffsets: [-1, -1, -1, 0, 1, 1, 1, 0],
            progress: 0,
            sin: Math.PI,
            size: 0,
            initialSize: 16,
            rangeSize: 16,
            rotation: 0
        };
    }

    start() {
        const w = this.world.width;
        const h = this.world.height;

        this.settings.rangeSize = Math.min(w, h) / 16;
        this.settings.initialSize = Math.min(w, h) / 60;

        const cw = Math.round(w / this.settings.initialSize);
        const ch = Math.round(h / this.settings.initialSize);

        this.automata = new CellularAutomata(cw, ch);

        this.automata.forEach((cell: Cell, x: number, y: number) => {
            if (Math.random() > 0.9) {
                this.automata.data[x][y] = new Cell(null, 0);
            }
        });

        this._bindEvents();
    }

    update() {
        const delay = 1000;
        this.timers.exchange.delay(delay, () => {
            this.settings.progress = 0;
            this._exchange(this.automata);
        }, (actual: number) => {
            this.settings.progress = actual / delay;
        });

        this.timers.generate.delay(10, () => {
            this._generate();
        });

        this.timers.grow.delay(10, () => {
            this.automata.grow(0.01);
        });

        this.settings.rotation += 0.005;

        this.settings.sin += 0.006;
        this.settings.size = this.settings.initialSize + Math.sin(this.settings.sin) * this.settings.rangeSize + this.settings.rangeSize;
    }

    private _bindEvents() {
        this.on(InputEvents.PointerMoved, () => {
            this._delete();
        });
        this.on(InputEvents.PointerPressed, () => {
            this._delete();
        });
    }

    private _delete() {
        if (true || this.world.inputs.pointer.isPressed) {
            let center = new Vector2(this.world.width / 2, this.world.height / 2);
            let pointer = this.world.inputs.pointer.position;
            let real = center.add(pointer.subtract(center).rotate(-this.settings.rotation));
            let p = real.subtract(this.offset);
            let x = Math.round(p.x / this.settings.size);
            let y = Math.round(p.y / this.settings.size);
            for (let i = 0; i < 4; i++) {
                let dx = x + Math.round(Math.random() * 2 - 1);
                let dy = y + Math.round(Math.random() * 2 - 1);
                this.automata.data[dx][dy] = null;
            }
        }
    }

    private _generate() {
        const generation = this.automata.generate();
        this.automata.forEach((cell, x, y) => {
            let count = this.automata.around(x, y, this.settings.xOffsets, this.settings.yOffsets);
            if (cell) {
                if (count === 2 || count === 3 || count === 4) {
                    generation.data[x][y] = this.automata.data[x][y];
                }
            } else {
                if (count === 3) {
                    generation.data[x][y] = new Cell(null, 0);
                }
            }
        });
        this.automata = generation;
    }

    private _exchange(automata: CellularAutomata) {
        const columns = automata.data.splice(0, 1);
        automata.data.push(columns[0]);
    }
}

export class GameOfLifeView extends TypedGameView<GameOfLife> {
    render(source: GameOfLife, context: CanvasRenderingContext2D) {
        const offset = source.offset;
        const size = source.settings.size;
        const offsetX = 1 - source.settings.progress;
        Graphics.scaleOffset(context, 4, 4, 1);

        Graphics.rotate(context, source.settings.rotation, 1, () => {
            //context.beginPath();
            source.automata.forEach((cell: Cell, x: number, y: number) => {
                if (cell) {
                    const p = new Vector2(x + offsetX, y).multiply(size).add(offset);
                    const real = size * cell.scale;
                    const half = real / 2;
                    context.fillStyle = new Color(255, 255, 255, cell.scale ** 5).rgba;
                    context.fillRect(p.x - half, p.y - half, real, real)
                }
            });
            // context.closePath();
            // context.fillStyle = Colors.White.rgba;
            // context.fill();
        });
    }
}