/**
 * Represents a RGBA (red, green, blue, alpha) color.
 */
class Color {
    constructor(r = 255, g = 255, b = 255, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    getHexValue() {
        let r = parseInt(this.r);
        let g = parseInt(this.g);
        let b = parseInt(this.b);
        let gx = g < 16 ? "0" : "";
        let rx = r < 16 ? "0" : "";
        let bx = b < 16 ? "0" : "";
        return `#${rx}${r.toString(16)}${gx}${g.toString(16)}${bx}${b.toString(16)}`;
    }
}

export {
    Color
};