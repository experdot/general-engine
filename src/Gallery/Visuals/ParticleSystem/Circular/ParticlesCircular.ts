import { ParticleSystem } from "../ParticleSystem";
import { GameView } from "../../../../Engine/Game/GameObject/GameView";
import { CircularParticle } from "./CircularParticle";
import { Vector2 } from "../../../../Engine/Numerics/Vector2";
import { GhostEffect } from "../../../../Engine/Game/GameComponents/Effect/Effect";
import { Color } from "../../../../Engine/UI/Color";
import { OffscreenCanvas } from "../../../../Engine/Drawing/OffscreenCanvas";
import { Random } from "../../../../Engine/Numerics/Random";
import { Graphics } from "../../../../Engine/Drawing/Graphics";

export class ParticlesCircular extends ParticleSystem<CircularParticle> {
    random: Random = new Random();
    scale: number = 1;
    count: number = 0;

    constructor() {
        super();
        this.joint(new GhostEffect(new Color(0, 128, 128, 0.006), 20));
    }
    start() {
        const center = this.world.size.center;
        const size = Math.min(center.x, center.y);

        const particle = new CircularParticle();
        particle.radius = this.random.normal(size / 4, size / 2);
        this.particles.push(particle);

    }

    update() {
        this.count += 0.001;
        this.scale = 1 + Math.abs(Math.sin(this.count));
    }
}

export class ParticlesCircularView extends GameView {
    render(source: ParticlesCircular, context: CanvasRenderingContext2D) {
        const center = source.world.size.center;
        const size = Math.min(center.x, center.y);
        const offset = size / 128;

        Graphics.scaleOffset(context, offset, offset * center.y / center.x, 0.99);

        source.particles.forEach((v, index) => {
            if (index === 0) {
                this.drawCirclePath(context, center.x, center.y, v.radius * source.scale);
                context.fillStyle = "#FFFFFF";
                context.fill();
            }
        });
    }

    private drawCirclePath(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
    }
}