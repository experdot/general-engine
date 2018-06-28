import {
    DynamicParticle
} from "./DynamicParticle";
import {
    Random
} from "../../../../../Engine/Numerics/Random";

class WalkerParticle extends DynamicParticle {
    constructor(location, size = 1, age = 0) {
        super(location, size, age);
        this.random = new Random();
        this.maxSize = 1;
        this.maxAge = 300;
    }

    update(rect, target) {
        if (this.age < this.maxAge) {
            this.age += 1;
            this.size = this.maxSize * this.age / this.maxAge;
            this.mass = this.size * this.size * this.size;
            this.velocityUpon = this.size / 2;
        }

        let vec = target.subtract(this.location);
        let length = vec.length();
        if (length < this.size / 2) {
            this.age = 0;
            this.size = 1;
            this.mass = 1;
            this.location = this.origin.clone();
        } else {
            let norm = vec.normalize();
            let ratio = WalkerParticle.StaticGravityRatio || 0;
            let attraction = norm.multiply(this.mass / (length * length) * ratio);
            this.applyForce(attraction);
        }
        this.move();
    }
}

export {
    WalkerParticle
};