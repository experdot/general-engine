import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    Colors
} from "../../../../Engine/UI/Color";

class Block {
    constructor(x = 0, y = 0) {
        this.location = new Vector2(x, y);
        this.color = Colors.White;
    }

    setLocation(location) {
        this.location = location;
        return this;
    }
    setColor(color) {
        this.color = color;
        return this;
    }
}
export {
    Block
};