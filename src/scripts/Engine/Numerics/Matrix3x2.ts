import { Vector2 } from "./Vector2";

export class Matrix3x2 {
    static get Identity() {
        return new Matrix3x2();
    }

    static createScale(xScale: number, yScale: number, centerPoint: Vector2) {
        let result = new Matrix3x2();
        let tx = centerPoint.x * (1 - xScale);
        let ty = centerPoint.y * (1 - yScale);
        result.M11 = xScale;
        result.M12 = 0.0;
        result.M21 = 0.0;
        result.M22 = yScale;
        result.M31 = tx;
        result.M32 = ty;
        return result;
    }

    static createRotation(rotation: number, centerPoint: Vector2) {
        let result = new Matrix3x2();
        let c = Math.cos(rotation);
        let s = Math.sin(rotation);
        let x = centerPoint.x * (1 - c) + centerPoint.y * s;
        let y = centerPoint.y * (1 - c) - centerPoint.x * s;
        result.M11 = c;
        result.M12 = s;
        result.M21 = -s;
        result.M22 = c;
        result.M31 = x;
        result.M32 = y;
        return result;
    }

    static createTranslation(position: Vector2) {
        let result = new Matrix3x2();
        result.M11 = 1.0;
        result.M12 = 0.0;
        result.M21 = 0.0;
        result.M22 = 1.0;
        result.M31 = position.x;
        result.M32 = position.y;
        return result;
    }

    M11: number;
    M12: number;
    M21: number;
    M22: number;
    M31: number;
    M32: number;

    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.M11 = a;
        this.M12 = b;
        this.M21 = c;
        this.M22 = d;
        this.M31 = tx;
        this.M32 = ty;
        return this;
    }

    toArray() {
        return [this.M11, this.M12, this.M21, this.M22, this.M31, this.M32];
    }

    toIdentity() {
        this.M11 = this.M22 = 1;
        this.M12 = this.M21 = this.M31 = this.M32 = 0;
        return this;
    }

    transform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, originX: number, originY: number) {
        var cos = Math.cos(rotation);
        var sin = Math.sin(rotation);

        this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);

        if (originX || originY) {
            this.M31 -= originX * this.M11 + originY * this.M21;
            this.M32 -= originX * this.M12 + originY * this.M22;
        }
        return this;
    }

    append(a: number, b: number, c: number, d: number, tx: number, ty: number) {
        var a1 = this.M11;
        var b1 = this.M12;
        var c1 = this.M21;
        var d1 = this.M22;
        this.M11 = a * a1 + b * c1;
        this.M12 = a * b1 + b * d1;
        this.M21 = c * a1 + d * c1;
        this.M22 = c * b1 + d * d1;
        this.M31 = tx * a1 + ty * c1 + this.M31;
        this.M32 = tx * b1 + ty * d1 + this.M32;
        return this;
    }

    multiply(matrix: Matrix3x2) {
        this.append(matrix.M11, matrix.M12, matrix.M21, matrix.M22, matrix.M31, matrix.M32);
        return this;
    }

    invert() {
        let a1 = this.M11;
        let b1 = this.M12;
        let c1 = this.M21;
        let d1 = this.M22;
        let tx1 = this.M31;
        let n = a1 * d1 - b1 * c1;

        this.M11 = d1 / n;
        this.M12 = -b1 / n;
        this.M21 = -c1 / n;
        this.M22 = a1 / n;
        this.M31 = (c1 * this.M32 - d1 * tx1) / n;
        this.M32 = -(a1 * this.M32 - b1 * tx1) / n;
        return this;
    }
}
