import {
    Color,
    ColorHelper
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
import {
    GameView
} from "../../../Core/GameObject/GameView";

class ParticlesWalker extends ParticlesBase {
    constructor(view) {
        super(view);
        this.random = new Random();
    }

    start() {
        let w = this.world.width;
        let h = this.world.height;
        this.walkers = [];
        this.split = 1;
        let center = new Vector2(w / 2, h * 0.8);
        this.center = center;

        WalkerParticle.StaticGravityRatio = 5000;
        let particle = new WalkerParticle(center);
        particle.origin = particle.location.clone();
        particle.maxSize = 10;
        particle.color = new Color(255, 255, 255, 0.1);
        particle.direction = new Vector2(0, -this.world.width / 10);
        this.walkers.push(particle);

        this.maxDepth = 6 + parseInt(w / 600);
        this.createNodes(this.walkers, particle, this.maxDepth, this.split, 1);

        this.fillColor = new Color(0, 128, 128, 0.005);
        this.view.drawProcess.next(context => {
            context.fillStyle = this.fillColor.getRGBAValue();
            context.fillRect(0, 0, w, h);
        }, 0);

        this.period = Math.PI / 3;
        this.rotationDelta = Math.random() * 3;

        this.particles = this.walkers;
    }

    update() {
        const rect = {
            width: this.world.width,
            height: this.world.height
        };

        this.transform.center = new Vector2(rect.width / 2, rect.height / 2);
        this.transform.rotation = this.transform.rotation + this.rotationDelta;

        //this.period = (this.period + 0.0001) % (Math.PI * 2);
        //this.rotationDelta = Math.sin(this.period) * 3;

        this.walkers.forEach((element, index) => {
            element.update(rect, index === 0 ? this.center : element.parent.location);
        });

        if (Math.random() > 0.5) {
            this.fillColor = ColorHelper.getGradientRandomColor(this.fillColor, 40);
        }

        if (Math.random() > 0.5) {
            this.split += (Math.random() * 1.6 - 0.8);
            this.split = Math.max(1, Math.min(12, this.split));
        }
        this.modifyNodes(this.walkers[0], this.split, 1 * this.split / 10);
    }

    createNodes(walkers, node, depth, split = 1, ratio = 1) {
        if (depth > 0) {
            const inverse = [-1, 1, 0];
            node.children = [];
            for (let index = 0; index < 2; index++) {
                let particle = new WalkerParticle();
                particle.direction = node.direction.rotate(Math.PI / split * inverse[index]);
                particle.location = node.location.add(particle.direction.multiply(ratio));
                particle.origin = particle.location.clone();
                particle.parent = node;
                particle.maxSize = node.maxSize * 0.8;
                particle.color = new Color(255, 255, 255, 1 / this.maxDepth - 0.05 * depth);
                node.children.push(particle);
                this.walkers.push(particle);
                this.createNodes(walkers, particle, depth - 1, split, ratio);
            }
        }
    }

    modifyNodes(node, split, ratio = 1) {
        if (node.children && node.children.length > 0) {
            const inverse = [-1, 1, 0];
            for (let index = 0; index < 2; index++) {
                const particle = node.children[index];
                particle.direction = node.direction.rotate(Math.PI / split * inverse[index]);
                particle.origin = node.origin.add(particle.direction.multiply(ratio));
                this.modifyNodes(particle, split, ratio);
            }
        }
    }
}

class ParticlesWalkerView extends GameView {
    constructor(target, scale = 1) {
        super(target);
        this.scale = scale;
    }

    draw(context) {
        if (this.target.stopDraw) {
            return;
        }
        for (let index = 0; index < this.target.particles.length; index++) {
            const element = this.target.particles[index];
            let p = element.location;
            // context.beginPath();
            // context.arc(p.x, p.y, element.size / 2 * this.scale, 0, Math.PI * 2, false);
            // context.fillStyle = element.color.getRGBAValue();
            // context.fill();

            if (element.parent) {
                context.beginPath();
                context.moveTo(p.x, p.y);
                context.lineTo(element.parent.location.x, element.parent.location.y);
                context.lineWidth = element.size * this.scale;
                context.strokeStyle = element.color.getRGBAValue();
                context.closePath();
                context.stroke();
            }
        }
    }
}


export {
    ParticlesWalker,
    ParticlesWalkerView
};