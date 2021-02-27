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
import { Array2 } from "../../../../Engine/Collections/Array2";
import { GalleryImages } from "../../../Resources/GalleryImages";

interface IGameOfLifeSettings {
    xOffsets: Array<number>;
    yOffsets: Array<number>;
    size: number;
}

export class GameOfLife extends GameVisual {
    get offset() {
        if (this.settings && this.automata) {
            let size = this.settings.size;
            let xOffset = this.world.size.width / 2 - size * this.automata.width / 2;
            let yOffset = this.world.size.height / 2 - size * this.automata.height / 2;
            return new Vector2(xOffset, yOffset);
        }
        return null;
    }

    automata: CellularAutomata;
    settings: IGameOfLifeSettings;
    ghost: GhostEffect;

    image: HTMLImageElement;
    colors: Array2<Color>;

    private timers: { generate: DelayTimer; exchange: DelayTimer; grow: DelayTimer };

    constructor() {
        super();

        this.ghost = new GhostEffect(new Color(0, 255, 0, 0.006), 50);
        this.joint(this.ghost);

        this.timers = {
            generate: new DelayTimer(),
            exchange: new DelayTimer(),
            grow: new DelayTimer()
        };

        this.settings = {
            xOffsets: [-1, 0, 1, 1, 1, 0, -1, -1],
            yOffsets: [-1, -1, -1, 0, 1, 1, 1, 0],
            size: 4
        };

        this.image = new Image();
        this.image.src = "../static/girl.png";

        // this.settings.xOffsets = [-1, 0, 1, 1, 1, 0, -1, -1, -2, -1, 0, 1, 2, 2, 2, 2, 2, 1, 0, -1, -2, -2, -2, -2];
        // this.settings.yOffsets = [-1, -1, -1, 0, 1, 1, 1, 0, -2, -2, -2, -2, -2, -1, 0, 1, 2, 2, 2, 2, 2, 1, 0, -1];
        // this.settings.xOffsets = [-1, 1, 0, 0];
        // this.settings.yOffsets = [0, 0, -1, 1];
    }

    start() {
        const w = this.world.width;
        const h = this.world.height;

        const cw = 200 || w / 20;
        const ch = 200 || h / 20;

        setTimeout(() => {
            this.colors = Graphics.getImageData(this.image);
            this.automata = new CellularAutomata(cw, ch);
            this.automata.forEach((cell: Cell, x: number, y: number) => {
                //const color = Colors.Random || new Color(x * 2, y * 2, (x + y) * 2);
                const color = this.colors.get(x, y).clone();
                this.automata.data[x][y] = new Cell(color, 1);
            });
        }, 500);
    }

    private single: number = 0;
    update() {
        this.timers.generate.delay(20, () => {
            this._generate();
        });
        //this.single = (this.single + 0.01) % (Math.PI * 2);
        //this.settings.size = 5 + Math.sin(this.single + Math.PI * 3 / 2) * 10;
    }

    private _generate() {

        if (!this.automata) {
            return;
        }

        const generation = this.automata.generate();
        // this.automata.forEach((cell, x, y) => {
        //     const current = this.automata.data[x][y];
        //     current.update();
        // });
        this.automata.forEach((cell, x, y) => {
            const { aroundColor, aroundDeltas } = this.automata.aroundColor(x, y, this.settings.xOffsets, this.settings.yOffsets);
            generation.data[x][y] = this.automata.data[x][y];
            generation.data[x][y].color = ColorHelper.gradientRandomRGB(aroundColor, aroundDeltas.ar, aroundDeltas.ag, aroundDeltas.ab);
        });
        this.automata = generation;
    }
}

export class GameOfLifeView extends TypedGameView<GameOfLife> {
    private single: number = 0;
    private timers: { generate: DelayTimer; exchange: DelayTimer; grow: DelayTimer };
    constructor() {
        super();
        this.timers = {
            generate: new DelayTimer(),
            exchange: new DelayTimer(),
            grow: new DelayTimer()
        };
    }

    render(source: GameOfLife, context: CanvasRenderingContext2D) {
        if (!source.automata) {
            return;
        }

        this.timers.generate.delay(50, () => {
            const offset = source.offset;
            const size = source.settings.size;
            Graphics.scaleOffset(context, 4, 4, 1);

            //this.single = (this.single + 0.001) % (Math.PI * 2);
            Graphics.rotate(context, this.single, 1, (innerContext) => {
                source.automata.forEach((cell: Cell, x: number, y: number) => {
                    if (cell) {
                        const p = new Vector2(x, y).multiply(size).add(offset);
                        const real = size * cell.scale;
                        const half = real / 2;
                        let color = cell.color;
                        innerContext.fillStyle = color.rgbaAbs;
                        innerContext.fillRect(p.x - half, p.y - half, real, real);
                        //innerContext.strokeStyle = color.rgba;
                        //innerContext.strokeRect(p.x - half, p.y - half, real, real);
                    }
                });
            });
        });
    }
}