import { Vector2 } from "@legacy/Engine/Numerics/Vector2";
import { Color } from "@legacy/Engine/UI/Color";

export class Vertex {
    location: Vector2;
    color: Color;

    constructor(location: Vector2, color: Color) {
        this.location = location;
        this.color = color;
    }
}