import {
    Color
} from "../../../../Fundamental/Color";
import {
    Vector2
} from "../../../../Fundamental/Vector";
import {
    Random
} from "../../../../Fundamental/Random";
import {
    ParticlesBase
} from "../ParticleSystem";
import {
    SpotParticle
} from "../Particle/SpotParticle";

class ParticlesTree extends ParticlesBase {
    constructor(view) {
        super(view);
        this.spots = [];
        this.random = new Random();
    }

    start() {
        var minLength = Math.min(this.world.width, this.world.height);
        var ratio = minLength / 2500 * Math.log10(minLength);
        var center = new Vector2(this.world.width / 2, this.world.height * 1.45);
        var root = new SpotParticle(center);
        root.velocity = new Vector2(0, -16 * ratio);
        root.size = 256 * ratio;
        root.age = 30;
        root.color = new Color(10, 10, 10);
        this.spots.push(root);
        this.particles = this.spots;
    }

    update() {
        if (this.stopDraw) {
            return;
        }

        if (this.spots.length > 60000) {
            this.stopDraw = true;
            return;
        }
        if (this.spots.length > 0) {
            for (let index = 0; index < this.spots.length; index++) {
                const element = this.particles[index];
                element.update(this.spots, parseInt(this.random.nextNorm(1, 3)));
            }
            this.killDead(this.spots);
        }
    }
}

export {
    ParticlesTree
};