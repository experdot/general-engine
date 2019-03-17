import { SparkParticle } from "./SparkParticle";
import { Vector2 } from "../../../../Engine/Numerics/Vector2";
import { ParticleSystem } from "../ParticleSystem";
import { FlameParticle } from "./FlameParticle";
import { InputEvents } from "../../../../Engine/Common/Inputs";
import { GameView } from "../../../../Engine/Game/GameObject/GameView";
import { Graphics } from "../../../../Engine/Drawing/Graphics";

export class ParticlesFire extends ParticleSystem<FlameParticle> {
    aFires: FlameParticle[];
    aSpark: SparkParticle[];
    aSpark2: SparkParticle[];

    mouse: Vector2;

    constructor() {
        super();
        this.aFires = [];
        this.aSpark = [];
        this.aSpark2 = [];
    }

    start() {
        const center = this.world.size.center;
        this.mouse = new Vector2(center.x, center.y);
        this.on(InputEvents.PointerMoved, () => {
            this.mouse = this.world.inputs.pointer.position.clone();
        });
    }

    update() {
        this.aFires.push(new FlameParticle(this.mouse));
        this.aSpark.push(new SparkParticle(this.mouse));
        this.aSpark2.push(new SparkParticle(this.mouse));

        this.updateParticles(this.aFires);
        this.updateParticles(this.aSpark);
        this.updateParticles(this.aSpark2);
    }

    private updateParticles(particles: any[]) {
        for (var i = particles.length - 1; i >= 0; i--) {
            if (particles[i].alive)
                particles[i].update();
            else
                particles.splice(i, 1);
        }
    }
}

export class ParticlesFireView extends GameView {
    render(source: ParticlesFire, context: CanvasRenderingContext2D) {
        const mouse = source.mouse;

        Graphics.hold(context, () => {
            this.drawBackground(context);
            this.drawGradient(context, mouse);
            this.drawParticles(context, source);
        })
    }

    private drawBackground(context: CanvasRenderingContext2D) {
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(15,5,2,1)";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    private drawGradient(context: CanvasRenderingContext2D, mouse) {
        const grd = context.createRadialGradient(mouse.x, mouse.y - 200, 200, mouse.x, mouse.y - 100, 0);
        grd.addColorStop(0, "rgb( 15, 5, 2 )");
        grd.addColorStop(1, "rgb( 30, 10, 2 )");
        context.beginPath();
        context.arc(mouse.x, mouse.y - 100, 200, 0, 2 * Math.PI);
        context.fillStyle = grd;
        context.fill();
    }

    private drawParticles(context: CanvasRenderingContext2D, source) {
        context.globalCompositeOperation = "overlay";//or lighter or soft-light
        for (var i = source.aFires.length - 1; i >= 0; i--) {
            source.aFires[i].draw(context);
        }

        context.globalCompositeOperation = "soft-light";//"soft-light";//"color-dodge";
        for (var i = source.aSpark.length - 1; i >= 0; i--) {
            if ((i % 2) === 0) {
                source.aSpark[i].draw(context);
            }
        }

        context.globalCompositeOperation = "color-dodge";//"soft-light";//"color-dodge";
        for (var i = source.aSpark2.length - 1; i >= 0; i--) {
            source.aSpark2[i].draw(context);
        }
    }
}