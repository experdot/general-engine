import {
    Particle
} from "../Particle";
import {
    Vector2
} from "../../../../Engine/Fundamental/Vector";

class DynamicParticle extends Particle {
    constructor(location, size = 1, age = 0) {
        super(location, size, age);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.mass = 10.0;
        this.velocityUpon = Number.POSITIVE_INFINITY;
    }

    applyForce(force) {
        this.acceleration = this.acceleration.add(force.divide(this.mass));
    }

    move() {
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity.limitLength(this.velocityUpon);
        this.location = this.location.add(this.velocity);
        this.acceleration = new Vector2(0, 0);
    }

    moveTo(location) {
        this.location = location;
        this.velocity.setLength(0);
    }
}

export {
    DynamicParticle
};