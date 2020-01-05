/**
 * Represents a RGBA (red, green, blue, alpha) color.
 */
export class Color {
    static fromHex(hex: string) {
        const value = parseInt(hex.slice(1), 16);
        return new Color(value / 65536, value / 256 % 256, value % 256);
    }

    static fromNumber(number: number) {
        return new Color(number / 65536, number / 256 % 256, number % 256);
    }

    get hex() {
        const r = Math.floor(this.r);
        const g = Math.floor(this.g);
        const b = Math.floor(this.b);
        const rx = g < 16 ? "0" : "";
        const gx = r < 16 ? "0" : "";
        const bx = b < 16 ? "0" : "";
        return `#${rx}${r.toString(16)}${gx}${g.toString(16)}${bx}${b.toString(16)}`;
    }
    get rgb() {
        const r = Math.floor(this.r);
        const g = Math.floor(this.g);
        const b = Math.floor(this.b);
        return `rgb(${r},${g},${b})`;
    }
    get rgba() {
        const r = Math.floor(this.r);
        const g = Math.floor(this.g);
        const b = Math.floor(this.b);
        const a = this.a;
        return `rgba(${r},${g},${b},${a})`;
    }
    get rgbaAbs() {
        const r = Math.min(255, Math.floor(Math.abs(this.r)));
        const g = Math.min(255, Math.floor(Math.abs(this.g)));
        const b = Math.min(255, Math.floor(Math.abs(this.b)));
        const a = this.a;
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
    static gradient(color: Color, increment = 1) {
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

    static gradientRandom(color: Color, increment = 1) {
        const upon = 255;


        let r = color.r;
        r += increment;
        r = (r + 255) % upon;

        let g = color.g;
        g += increment * 1;
        g = (g + 255) % upon;

        let b = color.b;
        b += increment * 1;
        b = (b + 255) % upon;

        return new Color(r, g, b, color.a);
    }

    static gradientRandomRGB(color: Color, rIncrement: number, gIncrement: number, bIncrement: number, ) {
        const upon = 255;


        let r = color.r;
        r += rIncrement;
        r = (r + 255) % upon;

        let g = color.g;
        g += gIncrement;
        g = (g + 255) % upon;

        let b = color.b;
        b += bIncrement;
        b = (b + 255) % upon;

        return new Color(r, g, b, color.a);
    }

    static gradientRandomRGB2(color: Color, rIncrement: number, gIncrement: number, bIncrement: number, ) {
        const upon = 255;

        let r = color.r;
        r += rIncrement;
        if (r >= upon) {
            r = -r;
        }

        let g = color.g;
        g += gIncrement;
        if (g >= upon) {
            g = -g;
        }

        let b = color.b;
        b += bIncrement;
        if (b >= upon) {
            b = -b;
        }

        return new Color(r, g, b, color.a);
    }

    static _gradientRandom(color: Color, increment = 1) {
        const upon = 255;
        const half = increment / 2;

        let r = color.r;
        r += Math.random() * increment - half;
        r = Math.min(upon, Math.max(0, r));

        let g = color.g;
        g += Math.random() * increment - half;
        g = Math.min(upon, Math.max(0, g));

        let b = color.b;
        b += Math.random() * increment - half;
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b, color.a);
    }


    static gradientRandom2(color: Color, increment = 1) {
        const upon = 255;

        let r = color.r;
        r += Math.random() * increment + 1;
        r = Math.min(upon, Math.max(0, r));

        let g = color.g;
        g += Math.random() * increment + 1;
        g = Math.min(upon, Math.max(0, g));

        let b = color.b;
        b += Math.random() * increment + 1;
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b, color.a);
    }

    static gradientRandom3(color: Color, increment = 1) {
        const upon = 255;

        let v = Math.random() * increment + 1;

        let r = color.r;
        r += v;
        r = Math.min(upon, Math.max(0, r));

        let g = color.g;
        g += v;
        g = Math.min(upon, Math.max(0, g));

        let b = color.b;
        b += v;
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
        const gray = 255 * Math.random();
        return new Color(gray, gray, gray, 1);
    }
}
