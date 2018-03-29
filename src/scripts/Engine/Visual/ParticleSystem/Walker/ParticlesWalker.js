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

        let count = this.world.width / 10;
        for (let i = 0; i < count; i++) {
            let particle = new WalkerParticle(new Vector2(w * Math.random(), h * Math.random()));
            particle.maxSize = 0.06 * i + 1;
            particle.color = new Color(255, 255, 255, Math.random() * 0.38 + 0.62);
            this.walkers.push(particle);
        }
        this.particles = this.walkers;

        this.fillColor = new Color(0, 255, 0, 0.01);
        this.view.beforeDraw = (context) => {
            context.fillStyle = this.fillColor.getRGBAValue();
            context.fillRect(0, 0, w, h);
        };

        WalkerParticle.StaticGravityRatio = 5000;
        this.eventSystem.addHandler("onMouseWheel", event => {
            WalkerParticle.StaticGravityRatio += event.wheelDelta;
        });
    }

    update() {
        const rect = {
            width: this.world.width,
            height: this.world.height
        };
        this.walkers.forEach(element => {
            element.update(rect, this.world.input.mouse);
        });

        if (Math.random() > 0.5) {
            this.fillColor = this.fillColor.getRandomColor(20);
        }
    }
}

export {
    ParticlesWalker
};