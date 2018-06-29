import {
    CellularAutomata
} from "../CellularAutomata";
import {
    Vector2
} from "../../../../../Engine/Numerics/Vector2";
import {
    Colors,
    Color,
    ColorHelper
} from "../../../../../Engine/UI/Color";
import {
    Cell
} from "../Cell";
import {
    GameVisual
} from "../../../GameObject/GameVisual";
import {
    GameView
} from "../../../GameObject/GameView";

class GameOfLife extends GameVisual {
    constructor(view) {
        super(view);
        this.start.next(this._start);
        this.update.next(this._update);

        this.offsetX = [-1, 0, 1, 1, 1, 0, -1, -1];
        this.offsetY = [-1, -1, -1, 0, 1, 1, 1, 0];
    }

    _start() {
        let w = this.world.width;
        let h = this.world.height;

        this.cellSize = 6;

        let cx = Math.round(w / this.cellSize);
        let cy = Math.round(h / this.cellSize);
        this.CA = new CellularAutomata(cx, cy);

        this.CA.forEach((cell, x, y) => {
            if (Math.random() > 0.9) {
                this.addDefaultCell(this.CA, x, y);
            }
        });

        this.fillColor = new Color(0, 128, 128, 0.5);
        this.view.render.next(context => {
            context.fillStyle = this.fillColor.getRGBAValue();
            context.fillRect(0, 0, w, h);
        }, 0);

        this.cellColor = new Color(255, 255, 255, 1);

        this.on("PointerMoved", () => {
            //console.log(this.world.inputs.pointer.isPressed);
            if (this.world.inputs.pointer.isPressed) {
                let p = this.world.inputs.pointer.position;
                let x = Math.round(p.x / this.cellSize);
                let y = Math.round(p.y / this.cellSize);

                for (let i = 0; i < 4; i++) {
                    let dx = x + Math.round(Math.random() * 2 - 1);
                    let dy = y + Math.round(Math.random() * 2 - 1);
                    this.addDefaultCell(this.CA, dx, dy);
                }
                // this.addDefaultCell(this.CA, x - 1, y);
                // this.addDefaultCell(this.CA, x, y - 1);
                // this.addDefaultCell(this.CA, x + 1, y);
                // this.addDefaultCell(this.CA, x, y + 1);
            }
        }, true);

        this.tick = 0;
    }


    _update() {
        if (Math.random() > 0.5) {
            this.fillColor = ColorHelper.getGradientRandomColor(this.fillColor, 10);
        }
        this.tick += 1;
        if (this.tick % 6 !== 0) {
            return;
        }
        let generation = this.CA.generate();
        this.CA.forEach((cell, x, y) => {
            let count = this.CA.getAround(x, y, this.offsetX, this.offsetY);
            if (cell) {
                if (count === 2 || count === 3) {
                    let cell = this.CA.getCell(x, y);
                    generation.setCell(x, y, cell);
                }
            } else {
                if (count === 3) {
                    this.addDefaultCell(generation, x, y);
                }
            }
        });
        this.CA = generation;
    }

    addDefaultCell(ca, x, y, color = Colors.White()) {
        let location = new Vector2(x * this.cellSize, y * this.cellSize);
        ca.setCell(x, y, new Cell()).setLocation(location).setColor(color).setSize(this.cellSize);
    }
}

class GameOfLifeView extends GameView {
    draw(context) {
        this.target.CA.forEach(cell => {
            if (cell) {
                let p = cell.location;
                context.fillStyle = cell.color.getRGBAValue();
                context.fillRect(p.x, p.y, cell.size, cell.size);
            }
        });
    }
}

export {
    GameOfLife,
    GameOfLifeView
};