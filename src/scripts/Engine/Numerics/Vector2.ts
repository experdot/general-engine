/**
 * Represents a 2-demesional vector
 */
export class Vector2 {
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    get sqrtLength() {
        return this.x * this.x + this.y * this.y;
    }

    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    normalize() {
        var inv = 1 / this.length;
        return new Vector2(this.x * inv, this.y * inv);
    }

    negate() {
        return new Vector2(-this.x, -this.y);
    }

    add(v: Vector2) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector2) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(f: number) {
        return new Vector2(this.x * f, this.y * f);
    }

    divide(f: number) {
        var invf = 1 / f;
        return new Vector2(this.x * invf, this.y * invf);
    }

    dot(v: Vector2) {
        return this.x * v.x + this.y * v.y;
    }

    rotate(r: number) {
        var sin = Math.sin(r);
        var cos = Math.cos(r);
        return new Vector2(this.x * cos - this.y * sin, this.y * cos + this.x * sin);
    }

    setLength(t: number) {
        var len = this.length;
        if (len > 0) {
            this.x = this.x * t / len;
            this.y = this.y * t / len;
        }
    }

    limitLength(upon: number) {
        var len = this.length;
        if (len > upon) {
            this.setLength(upon);
        }
    }

    cos(v: Vector2) {
        return this.dot(v) / (this.length * v.length);
    }
}