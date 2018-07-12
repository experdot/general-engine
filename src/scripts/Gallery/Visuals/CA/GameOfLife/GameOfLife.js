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
    ScaleCell
} from "../Cell";
import {
    GameView
} from "../../../../Engine/Game/GameObject/GameView";
import {
    Graphics
} from "../../../../Engine/Drawing/Graphics";
import {
    DelayTimer
} from "../../../../Engine/Common/DelayTimer";

class GameOfLife extends GameVisual {
    get offset() {
        let size = this.settings.size;
        let initial = this.settings.initialSize;
        let xOffset = -(size - initial) * this.CA.width / 2;
        let yOffset = -(size - initial) * this.CA.height / 2;
        return new Vector2(xOffset, yOffset);
    }

    constructor(view) {
        super(view);

        this.ghost = this.joint(new GhostEffect(new Color(0, 0, 0, 0.08), 0));

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
        let w = this.world.width;
        let h = this.world.height;

        this.settings.rangeSize = Math.min(w, h) / 16;
        this.settings.initialSize = Math.min(w, h) / 60;

        let cw = Math.round(w / this.settings.initialSize);
        let ch = Math.round(h / this.settings.initialSize);

        this.CA = new CellularAutomata(cw, ch);

        this.CA.forEach((cell, x, y) => {
            if (Math.random() > 0.9) {
                this.CA.data[x][y] = new ScaleCell();
            }
        });

        this._bindEvents();
    }

    update() {
        this.timers.exchange.delay(1000, () => {
            this.settings.progress = 0;
            this._exchange(this.CA);
        }, actual => {
            this.settings.progress = actual / 1000;
        });

        this.timers.generate.delay(1000, () => {
            this._generate();
        });

        this.timers.grow.delay(100, () => {
            this.CA.grow(0.005);
        });

        this.settings.rotation += 0.0001;

        this.settings.sin += 0.0005;
        this.settings.size = this.settings.initialSize + Math.sin(this.settings.sin) * this.settings.rangeSize + this.settings.rangeSize;
    }

    _bindEvents() {
        this.on("PointerMoved", () => {
            this._delete();
        });
        this.on("PointerPressed", () => {
            this._delete();
        });
    }

    _delete() {
        if (this.world.inputs.pointer.isPressed) {
            let center = new Vector2(this.world.width / 2, this.world.height / 2);
            let pointer = this.world.inputs.pointer.position;
            let real = center.add(pointer.subtract(center).rotate(-this.settings.rotation));
            let p = real.subtract(this.offset);
            let x = Math.round(p.x / this.settings.size);
            let y = Math.round(p.y / this.settings.size);
            for (let i = 0; i < 4; i++) {
                let dx = x + Math.round(Math.random() * 2 - 1);
                let dy = y + Math.round(Math.random() * 2 - 1);
                this.CA.data[dx][dy] = null;
            }
        }
    }

    _generate() {
        let generation = this.CA.generate();
        this.CA.forEach((cell, x, y) => {
            let count = this.CA.around(x, y, this.settings.xOffsets, this.settings.yOffsets);
            if (cell) {
                if (count === 2 || count === 3 || count === 4) {
                    generation.data[x][y] = this.CA.data[x][y];
                }
            } else {
                if (count === 3) {
                    generation.data[x][y] = new ScaleCell();
                }
            }
        });
        this.CA = generation;
    }

    _exchange(ca) {
        let columns = ca.data.splice(0, 1);
        ca.data.push(columns[0]);
    }
}

class GameOfLifeView extends GameView {
    render(source, context) {
        let offset = source.offset;
        let size = source.settings.size;
        let offsetX = 1 - source.settings.progress;
        Graphics.offsetScale(context, -4, -4, 1);

        Graphics.rotate(context, source.settings.rotation, 1, () => {
            context.beginPath();
            source.CA.forEach((cell, x, y) => {
                if (cell) {
                    let p = new Vector2((x + offsetX) * size, y * size).add(offset);
                    let real = size * cell.scale;
                    let half = real / 2;
                    context.rect(p.x - half, p.y - half, real, real);
                }
            });
            context.fillStyle = Colors.White.rgba;
            context.fill();
        });
    }
}

export {
    GameOfLife,
    GameOfLifeView
};