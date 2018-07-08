import {
    GameVisual
} from "../../../../Engine/Game/GameObject/GameVisual";
import {
    GhostEffect
} from "../../../../Engine/Game/GameComponents/Effect/Effect";
import {
    Color,
    Colors,
    ColorHelper
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
    GameView
} from "../../../../Engine/Game/GameObject/GameView";
import {
    Graphics
} from "../../../../Engine/Drawing/Graphics";
import {
    DelayTimer
} from "../../../../Engine/Common/DelayTimer";

class GameOfLife extends GameVisual {
    constructor(view) {
        super(view);
        this.start.next(this._start);
        this.update.next(this._update);

        this.timer = new DelayTimer();

        this.xOffsets = [-1, 0, 1, 1, 1, 0, -1, -1];
        this.yOffsets = [-1, -1, -1, 0, 1, 1, 1, 0];

        this.createColor = new Color(128, 128, 128, 1);

        this.progress = 0;

        this.proxy(new GhostEffect(new Color(0, 0, 0, 0.05), 0));
    }

    _start() {
        this.cellSize = 16;

        let w = this.world.width;
        let h = this.world.height;
        let cw = Math.round(w / this.cellSize);
        let ch = Math.round(h / this.cellSize);

        this.CA = new CellularAutomata(cw, ch);

        this.CA.forEach((cell, x, y) => {
            if (Math.random() > 0.9) {
                this._addDefaultCell(this.CA, x, y);
            }
        });

        this._bindEvents();
    }

    _update() {
        this.timer.delay(500, () => {
            this._generate();
            this.progress = 0;
        }, actual => {
            this.progress = actual / 500;
        });
    }

    _bindEvents() {
        this.on("PointerMoved", () => {
            if (this.world.inputs.pointer.isPressed) {
                this.createColor = ColorHelper.gradientRandom(this.createColor, 20);
                let p = this.world.inputs.pointer.position;
                let x = Math.round(p.x / this.cellSize);
                let y = Math.round(p.y / this.cellSize);
                for (let i = 0; i < 4; i++) {
                    let dx = x + Math.round(Math.random() * 2 - 1);
                    let dy = y + Math.round(Math.random() * 2 - 1);
                    let color = ColorHelper.gradientRandom(this.createColor, 10);
                    this._addDefaultCell(this.CA, dx, dy, color);
                }
            }
        });
    }

    _generate() {
        let generation = this.CA.generate();
        this.CA.forEach((cell, x, y) => {
            let count = this.CA.around(x, y, this.xOffsets, this.yOffsets);
            if (cell) {
                if (count === 2 || count === 3 || count === 4) {
                    let cell = this.CA.get(x, y);
                    generation.set(x, y, cell);
                }
            } else {
                if (count === 3) {
                    let color = this.CA.aroundColor(x, y, this.xOffsets, this.yOffsets);
                    this._addDefaultCell(generation, x, y, color);
                }
            }
        });
        this.CA = generation;

        this._exchangeColumns(this.CA);
    }

    _exchangeColumns(ca) {
        let columns = ca.data.splice(0, 1);
        ca.data.push(columns[0]);
    }

    _addDefaultCell(ca, x, y, color = Colors.Random) {
        ca.set(x, y, new Cell().setColor(color));
    }
}

class GameOfLifeView extends GameView {
    constructor() {
        super();
        this.single = 0;
    }
    draw(source, context) {
        this.single += 0.002;
        let size = 48 + Math.sin(this.single) * 32;
        Graphics.offsetScale(context, -6, -6, 0.99);
        this.target.CA.forEach((cell, x, y) => {
            if (cell) {
                let p = new Vector2((x + 1 - this.target.progress) * size, y * size);
                context.fillStyle = cell.color.rgba;
                context.fillRect(p.x, p.y, size, size);
            }
        });
    }
}

export {
    GameOfLife,
    GameOfLifeView
};