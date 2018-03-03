import { Vector2 } from "../../../Fundamental/Vector";

/**
 * Represents a 2-Demesional transform
 */
class Transform {
    constructor() {
        this.translation = new Vector2(0, 0);
        this.scale = new Vector2(1, 1);
        this.rotation = 0.0;
        this.center = new Vector2(0, 0);
    }
}

export {
    Transform
};