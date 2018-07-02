import {
    GameVisual
} from "../../GameObject/GameVisual";

class ParticlesBase extends GameVisual {
    constructor(view) {
        super(view);
        this.particles = [];
    }

    killDead() {
        let length = this.particles.length;
        if (length > 0) {
            for (let index = length - 1; index >= 0; index--) {
                const element = this.particles[index];
                if (element.dead) {
                    this.particles.splice(index, 1);
                }
            }
        }
    }
}

export {
    ParticlesBase
};