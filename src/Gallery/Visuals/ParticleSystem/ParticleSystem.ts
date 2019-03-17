import { GameVisual } from "../../../Engine/Game/GameObject/GameVisual";
import { Particle } from "./Particle";
import { Vector2 } from "../../../Engine/Numerics/Vector2";

export class ParticleSystem<T extends Particle> extends GameVisual {
    particles: T[] = [];

    static calcAverageLocation<T extends Particle>(particles: T[]) {
        if (particles.length > 0) {
            let sum = new Vector2();
            particles.forEach(element => {
                sum = sum.add(element.location);
            });
            return sum.divide(particles.length);
        }
        return new Vector2();
    }
}