import { ParticlesBase } from "../ParticleSystem";
import { GameView } from "../../../../Engine/Game/GameObject/GameView";
import { CircularParticle } from "./CircularParticle";
import { Vector2 } from "../../../../Engine/Numerics/Vector2";
import { GhostEffect } from "../../../../Engine/Game/GameComponents/Effect/Effect";
import { Color } from "../../../../Engine/UI/Color";
import { OffscreenCanvas } from "../../../../Engine/Drawing/OffscreenCanvas";
import { Random } from "../../../../Engine/Numerics/Random";
import { Graphics } from "../../../../Engine/Drawing/Graphics";

export class ParticlesCircular extends ParticlesBase<CircularParticle> {
    center: Vector2;
    random: Random = new Random();

    constructor() {
        super();
        this.joint(new GhostEffect(new Color(0, 128, 128, 0.01), 10));
    }
    start() {
        const center = this.world.size.center;
        this.center = new Vector2(center.x, center.y);

        const size = Math.min(this.center.x, this.center.y);

        const count = 10;
        for (let index = 0; index < count; index++) {
            const particle = new CircularParticle();
            particle.radius = this.random.normal(size / 4, size / 2) / (index + 1);
            particle.speed = Math.PI / 60 * (index + 1);
            this.particles.push(particle);
        }
    }

    update() {
        this.particles.forEach(v => {
            v.update();
        });
    }
}

export class ParticlesCircularView extends GameView {
    backLayer: OffscreenCanvas;
    frontLayer: OffscreenCanvas;
    last: Vector2;

    render(source: ParticlesCircular, context: CanvasRenderingContext2D) {
        if (!this.backLayer) {
            this.backLayer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        if (!this.frontLayer) {
            this.frontLayer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        let center = source.center;

        source.particles.forEach((v, index) => {
            this.drawCirclePath(context, center.x, center.y, v.radius);
            context.strokeStyle = "#FFFFFF";
            context.stroke();
            center = center.add(new Vector2(v.radius, 0).rotate(v.rotation));
        });

        this.backLayer.draw((innerContext) => {
            //this.drawCirclePath(innerContext, center.x, center.y, 2);
            //innerContext.fillStyle = "#000000";
            //innerContext.fill();

            if (this.last) {
                innerContext.beginPath();
                innerContext.moveTo(this.last.x, this.last.y);
                innerContext.lineTo(center.x, center.y);
                innerContext.closePath();
                innerContext.strokeStyle = "#000000";
                innerContext.stroke();

            }
        }).output(context, 0, 0);

        // this.frontLayer.draw((innerContext) => {
        //     Graphics.offset(innerContext, -1, 0, 0.1);

        //     if (this.last) {
        //         innerContext.beginPath();
        //         innerContext.moveTo(800, this.last.y);
        //         innerContext.lineTo(801, center.y);
        //         innerContext.closePath();
        //         innerContext.strokeStyle = "#000000";
        //         innerContext.stroke();
        //         //this.drawCirclePath(innerContext, 800, center.y, 1);
        //         //innerContext.fillStyle = "#000000";
        //         //innerContext.fillRect(800, center.y, 4, 4);
        //     }
        // }).output(context, 0, 0);


        this.last = center.clone();
    }

    drawCirclePath(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
    }
}