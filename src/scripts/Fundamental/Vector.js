//export { Vector2 };
/**
 * Represents a 2-demesional vector
 */
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Vector2(this.x, this.y);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    sqrLength() {
        return this.x * this.x + this.y * this.y;
    }
    normalize() {
        var inv = 1 / this.length();
        return new Vector2(this.x * inv, this.y * inv);
    }
    negate() {
        return new Vector2(-this.x, -this.y);
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    multiply(f) {
        return new Vector2(this.x * f, this.y * f);
    }
    divide(f) {
        var invf = 1 / f;
        return new Vector2(this.x * invf, this.y * invf);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    rotate(r) {
        var sin = Math.sin(r);
        var cos = Math.cos(r);
        return new Vector2(this.x * cos - this.y * sin, this.y * cos + this.x * sin);
    }
    setLength(t) {
        var len = this.length();
        if (len > 0) {
            this.x = this.x * t / len;
            this.y = this.y * t / len;
        }
    }
    limitLength(upon) {
        var len = this.length();
        if (len > upon) {
            this.setLength(upon);
        }
    }
}

export {
    Vector2
};