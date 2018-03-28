/**
 * Represents a RGBA (red, green, blue, alpha) color.
 */
class Color {
    static Black() {
        return new Color(0, 0, 0, 1);
    }
    static White() {
        return new Color(255, 255, 255, 1);
    }

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
    getRGBAValue() {
        let r = parseInt(this.r);
        let g = parseInt(this.g);
        let b = parseInt(this.b);
        let a = this.a;
        return `rgba(${r},${g},${b},${a})`;
    }

    getGradientColor(increment = 1) {
        const upon = 255;

        var r = this.r;
        r += increment;
        r = Math.min(upon, Math.max(0, r));

        var g = this.g;
        g += increment;
        g = Math.min(upon, Math.max(0, g));

        var b = this.b;
        b += increment;
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b, this.a);
    }

    getRandomColor(increment = 1) {
        const upon = 255;
        let half = increment / 2;

        var r = this.r;
        r += Math.random() * increment - half;
        r = Math.min(upon, Math.max(0, r));

        var g = this.g;
        g += Math.random() * increment - half;
        g = Math.min(upon, Math.max(0, g));

        var b = this.b;
        b += Math.random() * increment - half;
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b, this.a);
    }
}

export {
    Color
};