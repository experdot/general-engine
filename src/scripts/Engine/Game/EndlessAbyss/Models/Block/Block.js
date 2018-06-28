import {
    Colors
} from "../../../../../Engine/Fundamental/Color";
import {
    Vector2
} from "../../../../../Engine/Fundamental/Vector";

class Block {
    constructor() {
        this.location = new Vector2(0, 0);
        this.color = Colors.White();
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