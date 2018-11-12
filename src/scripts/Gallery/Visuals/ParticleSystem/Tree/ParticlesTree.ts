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
    ParticlesBase
} from "../ParticleSystem";
import {
    SpotParticle
} from "./SpotParticle";
import {
    GameView
} from "../../../../Engine/Game/GameObject/GameView";
import { Graphics } from "../../../../Engine/Drawing/Graphics";
import { OffscreenCanvas } from "../../../../Engine/Drawing/OffscreenCanvas";
import { GhostEffect } from "../../../../Engine/Game/GameComponents/Effect/Effect";

class ParticlesTree extends ParticlesBase {
    constructor() {
        super();
        this.spots = [];
        this.generation = [];
        this.random = new Random();

        this.settings = {
            update: true,
            updateIndex: 0,
            updateMax: 1000,
            drawIndex: 0,
            drawMax: 1000
        };

        //this.joint(new GhostEffect(new Color(0, 128, 128, 0.006), 30));
    }

    start() {
        var minLength = Math.min(this.world.width, this.world.height);
        var ratio = minLength / 2500 * Math.log10(minLength);
        var center = new Vector2(this.world.width / 2, this.world.height * 0.5 + minLength * 0.8);
        var root = new SpotParticle(center);
        root.velocity = new Vector2(0, -16 * ratio);
        root.size = 256 * ratio;
        root.age = 20;
        root.color = new Color(0, 0, 0, 1);
        this.spots.push(root);
        this.particles = this.spots;
    }

    update() {
        if (this.settings.update) {
            let count = 0;
            for (let index = this.settings.updateIndex; index < this.spots.length; index++) {
                const element = this.spots[index];
                element.update(this.generation, Math.ceil(this.random.normal(1, 3)));
                count += 1;
                this.settings.updateIndex += 1;
                if (count > this.settings.updateMax) {
                    break;
                }
            }
            if (this.settings.updateIndex >= this.spots.length) {
                this.settings.updateIndex = 0;
                this.settings.update = false;
                this.spots.push(...this.generation);
                this.generation = [];
                this.spots = this.spots.filter(p => !p.isDead);
                this.particles = this.spots;
            }
        }
    }

}

class ParticlesTreeView extends GameView {
    backLayer: OffscreenCanvas;

    render(source, context) {
        if (!this.backLayer) {
            this.backLayer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }
        //Graphics.scaleOffset(context, 12, 12 * context.canvas.height / context.canvas.width, 1);
        this.backLayer.draw((ctx) => {
            this.drawByFillCircle(source, ctx);
        }).output(context, 0, 0);
    }

    drawByFillCircle(source, context) {
        const PI_2 = Math.PI * 2;
        let count = 0;
        for (let index = source.settings.drawIndex; index < source.particles.length; index++) {
            const element = source.particles[index];
            let p = element.location;
            context.beginPath();
            context.arc(p.x, p.y, element.size / 2, 0, PI_2, false);
            context.fillStyle = element.color.rgb;
            context.fill();
            count += 1;
            source.settings.drawIndex += 1;
            if (count > source.settings.drawMax) {
                return;
            }
        }
        source.settings.drawIndex = 0;
        source.settings.update = true;
    }
}

export {
    ParticlesTree,
    ParticlesTreeView
};