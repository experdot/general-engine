import { Particle } from "../Particle";
import { Vector2 } from "../../../../Engine/Numerics/Vector2";

export class DynamicParticle extends Particle {
    velocity: Vector2;
    acceleration: Vector2;
    mass: number;
    velocityUpon: number;

    constructor(location?: Vector2, size = 1, age = 0) {
        super(location, size, age);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.mass = 10.0;
        this.velocityUpon = Number.POSITIVE_INFINITY;
    }

    applyForce(force: Vector2) {
        this.acceleration = this.acceleration.add(force.divide(this.mass));
    }

    move() {
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity.limitLength(this.velocityUpon);
        this.location = this.location.add(this.velocity);
        this.acceleration = new Vector2(0, 0);
    }

    moveTo(location: Vector2) {
        this.location = location;
        this.velocity.setLength(0);
    }
}