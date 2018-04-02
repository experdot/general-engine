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
        this.split = 1;
        let center = new Vector2(w / 2, h * 0.8);
        this.center = center;

        let particle = new WalkerParticle(center);
        particle.origin = particle.location.clone();
        particle.maxSize = 10;
        particle.color = new Color(255, 255, 255, 0.1);
        particle.direction = new Vector2(0, -this.world.width / 10);
        this.walkers.push(particle);
        this.createNodes(this.walkers, particle, 9, this.split, 1);

        this.fillColor = new Color(0, 128, 128, 0.005);
        this.view.beforeDraw = (context) => {
            context.fillStyle = this.fillColor.getRGBAValue();
            context.fillRect(0, 0, w, h);
        };
        this.view.scale = 2;

        WalkerParticle.StaticGravityRatio = 5000;
        this.eventSystem.addHandler("onMouseWheel", event => {
            WalkerParticle.StaticGravityRatio += event.wheelDelta;
        });

        this.particles = this.walkers;

        this.world.inputs.pointer.position = center.clone();
    }

    update() {
        const rect = {
            width: this.world.width,
            height: this.world.height
        };
        this.walkers.forEach((element, index) => {
            element.update(rect, index === 0 ? this.center : element.parent.location);
        });
        if (Math.random() > 0.5) {
            this.fillColor = this.fillColor.getRandomColor(20);
        }
        if (Math.random() > 0.8) {
            this.split += Math.random() * 1 - 0.5;
            this.split = Math.max(1, Math.min(12, this.split));
        }
        this.modifyNodes(this.walkers[0], this.split, 1 * this.split / 10);
    }

    createNodes(walkers, node, depth, split = 1, ratio = 1) {
        if (depth > 0) {
            const inverse = [-1, 1];
            node.children = [];
            for (let index = 0; index < 2; index++) {
                let particle = new WalkerParticle();
                particle.direction = node.direction.rotate(Math.PI / split * inverse[index]);
                particle.location = node.location.add(particle.direction.multiply(ratio));
                particle.origin = particle.location.clone();
                particle.parent = node;
                particle.maxSize = node.maxSize * 0.8;
                particle.color = new Color(255, 255, 255, 0.62);
                node.children.push(particle);
                this.walkers.push(particle);
                this.createNodes(walkers, particle, depth - 1, split, ratio);
            }
        }
    }

    modifyNodes(node, split, ratio = 1) {
        if (node.children && node.children.length > 0) {
            const inverse = [-1, 1];
            for (let index = 0; index < 2; index++) {
                const particle = node.children[index];
                particle.direction = node.direction.rotate(Math.PI / split * inverse[index]);
                particle.origin = node.origin.add(particle.direction.multiply(ratio));
                this.modifyNodes(particle, split, ratio);
            }
        }
    }
}

export {
    ParticlesWalker
};