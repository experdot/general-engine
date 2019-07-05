import {
    Color
} from "../../../../Engine/UI/Color";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    Random
} from "../../../../Engine/Numerics/Random";
import {
    ParticleSystem
} from "../ParticleSystem";
import {
    WalkerParticle
} from "./WalkerParticle";
import {
    Transform
} from "../../../../Engine/Numerics/Transform";
import {
    GhostEffect
} from "../../../../Engine/Game/GameComponents/Effect/Effect";
import {
    GameView
} from "../../../../Engine/Game/GameObject/GameView";
import {
    Graphics
} from "../../../../Engine/Drawing/Graphics";

class ParticlesWalker extends ParticleSystem<WalkerParticle> {
    random: Random;
    transform: Transform;
    split: number;
    center: Vector2;
    maxDepth: number;
    rotationDelta: number;

    constructor() {
        super();

        this.random = new Random();
        this.joint(new GhostEffect(new Color(0, 128, 128, 0.006), 40));

        this.transform = new Transform();
    }

    start() {
        let w = this.world.width;
        let h = this.world.height;
        this.split = 1;
        let center = new Vector2(w / 2, h * 0.8);
        this.center = center;

        WalkerParticle.StaticGravityRatio = 5000;
        let particle = new WalkerParticle(center);
        particle.origin = particle.location.clone();
        particle.maxSize = 10;
        particle.color = new Color(255, 255, 255, 0.1);
        particle.direction = new Vector2(0, -this.world.width / 10);
        this.particles.push(particle);

        this.maxDepth = 6 + Math.floor(w / 600);
        this.createNodes(this.particles, particle, this.maxDepth, this.split, 1);

        this.rotationDelta = Math.PI * 2 / Math.floor(Math.random() * 8 + 2);
    }

    update() {
        const rect = {
            width: this.world.width,
            height: this.world.height
        };

        this.transform.center = new Vector2(rect.width / 2, rect.height / 2);
        this.transform.rotation = this.transform.rotation + this.rotationDelta;

        if (this.transform.rotation > Math.PI * 10000) {
            this.transform.rotation = 0;
            this.rotationDelta = Math.PI * 2 / Math.floor(Math.random() * 8 + 2);
        }

        this.particles.forEach((element, index) => {
            element.update(rect, index === 0 ? this.center : element.parent.location);
        });

        if (Math.random() > 0.5) {
            this.split += (Math.random() * 1.6 - 0.8);
            this.split = Math.max(1, Math.min(16, this.split));
        }
        this.modifyNodes(this.particles[0], this.split, 1 * this.split / 10);
    }

    createNodes(particles, node, depth, split = 1, ratio = 1) {
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
                this.particles.push(particle);
                this.createNodes(particles, particle, depth - 1, split, ratio);
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
    render(source, context) {
        Graphics.scaleOffset(context, 2, 2 * context.canvas.height / context.canvas.width, 1);
        Graphics.transform(context, source.transform.toMatrix3x2(), () => {
            for (let index = 0; index < source.particles.length; index++) {
                const element = source.particles[index];
                let p = element.location;
                if (element.parent) {
                    context.beginPath();
                    context.moveTo(p.x, p.y);
                    context.lineTo(element.parent.location.x, element.parent.location.y);
                    context.lineWidth = element.size;
                    context.strokeStyle = element.color.rgba;
                    context.closePath();
                    context.stroke();
                }
            }
        });
    }
}


export {
    ParticlesWalker,
    ParticlesWalkerView
};