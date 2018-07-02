import {
    Color,
    Colors
} from "../../../../../Engine/UI/Color";
import {
    Vector2
} from "../../../../../Engine/Numerics/Vector2";
import {
    Random
} from "../../../../../Engine/Numerics/Random";
import {
    ParticlesBase
} from "../ParticleSystem";
import {
    FlyerParticle
} from "../Particle/FlyerParticle";
import {
    GameView
} from "../../../GameObject/GameView";
import {
    GhostEffect
} from "../../../GameComponents/Effect/Effect";
import {
    ArrayGrid
} from "./ArrayGrid";

class ParticlesFlyer extends ParticlesBase {
    constructor(view) {
        super(view);
        this.random = new Random();

        this.start.next(this._start);
        this.update.next(this._update);

        this.proxy(new GhostEffect(new Color(0, 128, 128, 0.005), 40));
    }

    _start() {
        let w = this.world.width;
        let h = this.world.height;
        let center = new Vector2(w * 0.5, h * 0.5);
        this.flyers = [];

        const screen = new Vector2(w, h).length();
        const flyersCount = parseInt(screen / 5);
        const maxSize = parseInt(screen / 60);
        const fieldWidth = w * 0.8;
        const fieldHeight = h * 0.8;
        for (let i = 0; i < flyersCount; i++) {
            let particle = new FlyerParticle();
            particle.location = center.add(new Vector2(fieldWidth * Math.random() - fieldWidth / 2, fieldHeight * Math.random() - fieldHeight / 2));
            particle.velocity = new Vector2(10 * Math.random() - 5, 10 * Math.random() - 5);
            particle.size = 2 + maxSize * Math.random();
            particle.color = Colors.White;
            this.flyers.push(particle);
        }

        this.particles = this.flyers;

        this.revolution = 20;
        this.grid = this.createGrid(w, h, this.revolution);

        if (this.world.inputs.pointer.position.length() === 0) {
            this.world.inputs.pointer.position = new Vector2(w / 2, h / 2);
        }
    }

    _update() {
        const rect = {
            width: this.world.width,
            height: this.world.height
        };

        this.grid.clear();
        this.allocateGrid(this.grid, this.particles, this.revolution);

        this.grid.forEach((cell, x, y) => {
            if (cell.length > 0) {
                let neighbours = this.grid.neighbours(x, y);
                cell.forEach(particle => {
                    particle.update(neighbours, rect, this.world.inputs.pointer.position);
                });
            }
        });
    }

    createGrid(width, height, revolution = 10) {
        let w = Math.ceil(width / revolution);
        let h = Math.ceil(height / revolution);
        return new ArrayGrid(w, h);
    }

    allocateGrid(grid, particles, revolution = 10) {
        particles.forEach(element => {
            let location = this.mapLocation(element.location, revolution);
            grid.getCell(location.x, location.y).push(element);
        });
    }

    mapLocation(location, revolution) {
        let x = Math.floor(location.x / revolution);
        let y = Math.floor(location.y / revolution);
        return new Vector2(x, y);
    }
}

class ParticlesFlyerView extends GameView {
    constructor(target) {
        super(target);
        this.rotation = 0;
    }

    draw(source, context) {
        if (this.target.stopDraw) {
            return;
        }

        this.rotation = this.rotation + 0.002;
        this.scaleCanvas(context, 16 * Math.sin(this.rotation));

        for (let index = 0; index < this.target.particles.length; index++) {
            const element = this.target.particles[index];
            let p = element.location;
            context.beginPath();
            context.arc(p.x, p.y, element.size / 2, 0, Math.PI * 2, false);
            context.closePath();
            context.fillStyle = element.color.rgba;
            context.fill();
        }
    }

    scaleCanvas(context, offset = 1) {
        let w = this.target.world.width + offset;
        let h = this.target.world.height + offset;
        context.translate(this.target.world.width / 2, this.target.world.height / 2);
        context.globalAlpha = 0.99;
        context.drawImage(context.canvas, -w / 2, -h / 2, w, h);
        context.globalAlpha = 1;
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}


export {
    ParticlesFlyer,
    ParticlesFlyerView
};