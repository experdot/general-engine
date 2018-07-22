import {
    DynamicParticle
} from "../Particle/DynamicParticle";
import {
    Random
} from "../../../../Engine/Numerics/Random";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    ColorHelper
} from "../../../../Engine/UI/Color";

class SpotParticle extends DynamicParticle {
    constructor(location, size = 1, age = 0) {
        super(location, size, age);

        this.angleOffset = Math.random() * 0.024 - 0.012;
        this.velocityUpon = 16.0;
        this.random = new Random();

    }

    update(generation, count) {
        if (this.age > 0) {
            this.age -= 1;
            this.size = this.size * config.sizeRadius;
            this.velocity = this.velocity.rotate(this.angleOffset * config.rotateRatio);
            this.velocity = this.velocity.rotate(this.random.normal(-100, 100) * config.rotateRatioRandom);
            this.color = ColorHelper.gradient(this.color, config.gradientColorIncrement);
            this.velocityUpon = this.size * 0.32;
            this.move();
        }

        if (this.size > config.sizeMinimum) {
            if (Math.random() < config.divideRatio) {
                this.divide(generation, count);
            }
        } else {
            this.velocity = new Vector2(-1, -1);
            this.isDead = true;
        }
    }

    divide(generation, count) {
        if (count < 2) {
            count = 2;
        }
        var newSize = this.size * config.divideSizeRatio;
        this.size = newSize;
        this.age = this.random.normal(0, 20);
        if (count > 1) {
            for (let i = 2; i <= count; i++) {
                newSize *= config.divideSizeRatioEx;
                let particle = new SpotParticle(this.location, newSize);
                particle.velocity = this.velocity.rotate(this.random.normal(-100, 100) * config.divideRotateRatio).multiply(config.divideLengthRatio);
                particle.age = this.random.normal(0, 40);
                particle.color = ColorHelper.gradient(this.color, config.gradientColorIncrement);
                particle.color.a = 0.96;
                generation.push(particle);
            }
        }
    }
}


const config = {
    sizeMinimum: 1,
    sizeRadius: 0.995,

    rotateRatio: 0.01,
    rotateRatioRandom: 0.003,

    divideRatio: 0.03,
    divideSizeRatio: 0.8,
    divideSizeRatioEx: 0.92,
    divideColorIncrementRatio: 1,

    divideRotateRatio: 0.012,
    divideLengthRatio: 0.7,

    gradientColorIncrement: 1.1,
};

export {
    SpotParticle
};