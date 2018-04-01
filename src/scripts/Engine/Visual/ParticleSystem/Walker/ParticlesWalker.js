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

        let count = this.world.width / 5;
        let center = new Vector2(w / 2, h / 2);
        let rotateOffset = Math.random() * Math.PI * 2;
        for (let i = 0; i < count; i++) {
            let location = new Vector2(w * Math.random(), h * Math.random());
            location = center.add(new Vector2(1, 0).multiply(i / count * h / 2).rotate(rotateOffset + i / count * Math.PI * 2));
            let particle = new WalkerParticle(location);
            particle.maxSize = 0.001 * i + 5;
            particle.color = new Color(255, 255, 255, Math.random() * 0.38 + 0.62);
            this.walkers.push(particle);
        }
        this.particles = this.walkers;

        this.fillColor = new Color(0, 128, 128, 0.01);
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
        this.walkers.forEach((element) => {
            element.update(rect, this.world.inputs.pointer.position);
        });

        if (Math.random() > 0.5) {
            this.fillColor = this.fillColor.getRandomColor(20);
        }
    }
}

export {
    ParticlesWalker
};