import {
    Vector2
} from "../../Engine/Numerics/Vector2";
import {
    Matrix3x2
} from "./Matrix3x2";

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

    toMatrix3x2() {
        let scale = Matrix3x2.createScale(this.scale.x, this.scale.y, this.center);
        let rotate = Matrix3x2.createRotation(this.rotation, this.center);
        let translate = Matrix3x2.createTranslation(this.translation);
        return scale.multiply(rotate).multiply(translate);
    }
}

export {
    Transform
};