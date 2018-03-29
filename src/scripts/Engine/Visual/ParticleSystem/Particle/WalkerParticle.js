import {
    DynamicParticle
} from "./DynamicParticle";
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

        let ratio = WalkerParticle.StaticGravityRatio || 0;
        let vec = mouse.subtract(this.location);
        let length = vec.length();

        if (length < 1) {
            this.age = 0;
            this.size = 1;
            this.mass = 1;
            this.location = new Vector2(rect.width * Math.random(), rect.height * Math.random());
        } else {
            let norm = vec.normalize();
            let attraction = norm.multiply(this.mass / (length * length) * ratio);
            this.applyForce(attraction);
        }

        //this.applyForce(new Vector2(1, 0).rotate(Math.PI * 2 * Math.random()).multiply(Math.random() * this.mass / 10));
        this.move();

        if (rect) {
            let x = this.location.x;
            let y = this.location.y;

            if (x < 0 || x > rect.width + 0 || y < 0 || y > rect.height) {
                this.velocity = this.velocity.multiply(-1);
                this.color = this.color.getRandomColor(Math.random() * 64);
            }
        }
    }
}

export {
    WalkerParticle
};