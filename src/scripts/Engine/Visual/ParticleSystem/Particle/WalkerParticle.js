import {
    DynamicParticle
} from "./DynamicParticle";
import {
    Color
} from "../../../../Fundamental/Color";
import {
    Random
} from "../../../../Fundamental/Random";
import {
    Vector2
} from "../../../../Fundamental/Vector";

class WalkerParticle extends DynamicParticle {
    constructor(location, size = 1, age = 0) {
        super(location, size, age);
        this.random = new Random();
    }

    update(rect, mouse) {
        this.color = this.getGradientColor(1);

        this.applyForce(new Vector2(10, 0).rotate(Math.PI * 2 * Math.random()).multiply(Math.random()));
        this.move();

        if (rect) {
            let x = this.location.x;
            let y = this.location.y;

            if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
                this.velocity = this.velocity.multiply(-1);
                this.location = new Vector2(mouse.x, mouse.y);
                this.color = this.getDivideColor(Math.random() * 64);
            }
        }
    }

    getGradientColor(increment = 1) {
        const upon = 255;

        var r = this.color.r;
        r += increment;
        r = Math.min(upon, Math.max(0, r));

        var g = this.color.g;
        g += increment;
        g = Math.min(upon, Math.max(0, g));

        var b = this.color.b;
        b += increment;
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b);
    }

    getDivideColor(increment = 1) {
        const upon = 255;

        var r = this.color.r;
        var len = this.velocity.length() * 5;
        var half = len / 2;

        r += increment * (Math.random() * len - half);
        r = Math.min(upon, Math.max(0, r));

        var g = this.color.g;
        g += increment * (Math.random() * len - half);
        g = Math.min(upon, Math.max(0, g));

        var b = this.color.b;
        b += increment * (Math.random() * len - half);
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b);
    }
}

export {
    WalkerParticle
};