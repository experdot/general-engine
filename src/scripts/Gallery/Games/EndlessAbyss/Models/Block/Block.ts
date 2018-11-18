import { Vector2 } from "../../../../../Engine/Numerics/Vector2";
import { Colors, Color } from "../../../../../Engine/UI/Color";

export class Block {
    location: Vector2;
    color: Color;

    constructor(x = 0, y = 0) {
        this.location = new Vector2(x, y);
        this.color = Colors.White;
    }

    setLocation(location: Vector2) {
        this.location = location;
        return this;
    }
    
    setColor(color: Color) {
        this.color = color;
        return this;
    }
}