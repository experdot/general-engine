import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    Colors
} from "../../../../Engine/UI/Color";

class Cell {
    constructor() {
        this.location = new Vector2(0, 0);
        this.color = Colors.Black;
        this.size = 1.0;
    }

    setLocation(location) {
        this.location = location;
        return this;
    }
    setColor(color) {
        this.color = color;
        return this;
    }
    setSize(size) {
        this.size = size;
        return this;
    }
}

export {
    Cell
};