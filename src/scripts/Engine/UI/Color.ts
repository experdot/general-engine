/**
 * Represents a RGBA (red, green, blue, alpha) color.
 */
export class Color {
    static fromHex(hex) {
        let value = parseInt(hex.slice(1), 16);
        return new Color(value / 65536, value / 256 % 256, value % 256);
    }

    static fromNumber(number) {
        return new Color(number / 65536, number / 256 % 256, number % 256);
    }

    get hex() {
        let r = Math.floor(this.r);
        let g = Math.floor(this.g);
        let b = Math.floor(this.b);
        let rx = g < 16 ? "0" : "";
        let gx = r < 16 ? "0" : "";
        let bx = b < 16 ? "0" : "";
        return `#${rx}${r.toString(16)}${gx}${g.toString(16)}${bx}${b.toString(16)}`;
    }
    get rgb() {
        let r = Math.floor(this.r);
        let g = Math.floor(this.g);
        let b = Math.floor(this.b);
        return `rgb(${r},${g},${b})`;
    }
    get rgba() {
        let r = Math.floor(this.r);
        let g = Math.floor(this.g);
        let b = Math.floor(this.b);
        let a = this.a;
        return `rgba(${r},${g},${b},${a})`;
    }

    r: number;
    g: number;
    b: number;
    a: number;

    constructor(r = 255, g = 255, b = 255, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }
}

export class ColorHelper {
    static gradient(color, increment = 1) {
        const upon = 255;

        var r = color.r;
        r += increment;
        r = Math.min(upon, Math.max(0, r));

        var g = color.g;
        g += increment;
        g = Math.min(upon, Math.max(0, g));

        var b = color.b;
        b += increment;
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b, color.a);
    }

    static gradientRandom(color, increment = 1) {
        const upon = 255;
        let half = increment / 2;

        var r = color.r;
        r += Math.random() * increment - half;
        r = Math.min(upon, Math.max(0, r));

        var g = color.g;
        g += Math.random() * increment - half;
        g = Math.min(upon, Math.max(0, g));

        var b = color.b;
        b += Math.random() * increment - half;
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b, color.a);
    }
}

export class Colors {
    static get Black() {
        return new Color(0, 0, 0, 1);
    }
    static get White() {
        return new Color(255, 255, 255, 1);
    }
    static get Gray() {
        return new Color(128, 128, 128, 1);
    }
    static get Random() {
        return new Color(255 * Math.random(), 255 * Math.random(), 255 * Math.random(), 1);
    }
    static get RandomGray() {
        let gray = 255 * Math.random();
        return new Color(gray, gray, gray, 1);
    }
}
