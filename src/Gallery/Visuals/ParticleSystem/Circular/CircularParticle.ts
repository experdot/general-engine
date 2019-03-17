import { Particle } from "../Particle";

export class CircularParticle extends Particle {
    radius: number = 0;
    rotation: number = 0;
    speed: number = 0;


    update() {
        this.rotation += this.speed;
    }
}