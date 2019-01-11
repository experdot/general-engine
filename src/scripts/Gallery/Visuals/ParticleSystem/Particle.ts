import { Color } from "../../../Engine/UI/Color";
import { Vector2 } from "../../../Engine/Numerics/Vector2";

export class Particle {
    location: Vector2;
    size: number;
    age: number;
    color: Color;
    dead: boolean;

    rotation?: number;
    alpha?: number;

    constructor(location: Vector2 = Vector2.Zero, size = 1, age = 0) {
        this.location = location;
        this.size = size;
        this.age = age;
        this.color = new Color(0, 0, 0, 1);
        this.dead = false;
    }
}