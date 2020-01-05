import { Color, ColorHelper } from "../../../Engine/UI/Color";
import { Random } from "../../../Engine/Numerics/Random";

export class Cell {
    color: Color;
    scale: number;

    colorRatio: number = 0;
    scaleRatio: number = 0;

    value?: any;

    static random = new Random();

    constructor(color: Color, scale = 0) {
        this.color = color;
        this.scale = scale;

        this.colorRatio = Cell.random.normal(0, 1);
        this.scaleRatio = Cell.random.normal(0, 1);
    }

    setColor(color: Color) {
        this.color = color;
        return this;
    }

    update() {
        //this.color = ColorHelper.gradientRandom(this.color, 10 * this.colorRatio);
        //this.scale = (this.scale * (1 + this.scaleRatio)) % 1;
    }
}