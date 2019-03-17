import { Color } from "../../../Engine/UI/Color";

export class Cell {
    color: Color;
    scale: number;

    constructor(color: Color, scale = 0) {
        this.color = color;
        this.scale = scale;
    }

    setColor(color: Color) {
        this.color = color;
        return this;
    }
}

export class ScaleCell {
    scale: number;

    constructor(scale = 0) {
        this.scale = scale;
    }
}