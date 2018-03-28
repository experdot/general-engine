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
        this.maxSize = 1;
        this.maxAge = 300;
    }

    update(rect, mouse) {
        if (this.age < this.maxAge) {
            this.age += 1;
            this.size = this.maxSize * this.age / this.maxAge;
            this.mass = this.size * this.size;
            this.velocityUpon = this.size / 2;
        }

        this.color = this.getGradientColor(1);

        let ratio = 20000;
        let vec = mouse.subtract(this.location);
        let length = vec.length();

        if (length < 1) {
            this.age = 0;
            this.size = 1;
            this.mass = 1;
            this.color = this.getDivideColor(Math.random() * 64);
            this.location = new Vector2(rect.width * Math.random(), rect.height * Math.random());
        } else {
            let norm = vec.normalize();
            let attraction = norm.multiply(this.mass / (length * length) * ratio);
            this.applyForce(attraction);
        }

        //this.applyForce(new Vector2(1, 0).rotate(Math.PI * 2 * Math.random()).multiply(Math.random() * this.mass / 10));
        this.move();

        // if (rect) {
        //     let x = this.location.x;
        //     let y = this.location.y;

        //     if (x < -1000 || x > rect.width + 1000 || y < -1000 || y > rect.height + 1000) {
        //         this.velocity = this.velocity.multiply(-1);
        //         this.color = this.getDivideColor(Math.random() * 64);
        //     }
        // }
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