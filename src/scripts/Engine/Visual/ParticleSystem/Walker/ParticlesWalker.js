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
    WalkerParticle
} from "../Particle/WalkerParticle";

class ParticlesWalker extends ParticlesBase {
    constructor(view) {
        super(view);
        this.spots = [];
        this.random = new Random();
    }

    start() {
        let w = this.world.width;
        let h = this.world.height;
        this.walkers = [];

        let count = this.world.width * 3;
        for (let i = 0; i < count; i++) {
            let particle = new WalkerParticle();
            particle.location = new Vector2(w * Math.random(), h * Math.random());
            particle.velocity = new Vector2(16 * Math.random() - 8, -16 * Math.random() - 8).rotate(Math.random() * Math.PI * 2);
            //particle.maxSize = 16 * Math.random() + 1;
            particle.maxSize = 0.001 * i + 1;
            particle.color = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
            this.walkers.push(particle);
        }
        this.particles = this.walkers;
        this.view.beforeDraw = (context) => {
            context.fillStyle = "rgba(0,0,0,0.02)";
            context.fillRect(0, 0, w, h);
        };
        this.mouse = new Vector2(w / 2, h / 2);
        this.world.canvas.addEventListener("mousemove", e => {
            this.mouse = new Vector2(e.offsetX, e.offsetY);
        });
    }

    update() {
        const rect = {
            width: this.world.width,
            height: this.world.height
        };
        this.walkers.forEach(element => {
            element.update(rect, this.mouse);
        });
    }
}

export {
    ParticlesWalker
};