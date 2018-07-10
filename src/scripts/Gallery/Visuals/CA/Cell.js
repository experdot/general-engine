class Cell {
    constructor(color, scale = 0) {
        this.color = color;
        this.scale = scale;
    }

    setColor(color) {
        this.color = color;
        return this;
    }
}

class ScaleCell {
    constructor(scale = 0) {
        this.scale = scale;
    }
}

export {
    Cell,
    ScaleCell
};