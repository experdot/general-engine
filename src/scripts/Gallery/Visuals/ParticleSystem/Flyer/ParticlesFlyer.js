import {
    ParticlesBase
} from "../ParticleSystem";
import {
    Random
} from "../../../../Engine/Numerics/Random";
import {
    GhostEffect
} from "../../../../Engine/Game/GameComponents/Effect/Effect";
import {
    Color,
    Colors
} from "../../../../Engine/UI/Color";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import {
    ArrayGrid
} from "./ArrayGrid";
import {
    GameView
} from "../../../../Engine/Game/GameObject/GameView";
import {
    Graphics
} from "../../../../Engine/Drawing/Graphics";
import {
    FlyerParticle
} from "./FlyerParticle";

class ParticlesFlyer extends ParticlesBase {
    constructor(view) {
        super(view);
        this.random = new Random();
        this.joint(new GhostEffect(new Color(0, 0, 0, 0.5), 10));
    }

    start() {
        let w = this.world.width;
        let h = this.world.height;
        let center = new Vector2(w * 0.5, h * 0.5);
        this.flyers = [];


        const screen = new Vector2(w, h).length;
        const flyersCount = parseInt(screen / 16) / 2;
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


        this.blocks = [];
        const blocksCount = 5;
        const areaSize = 2;
        const areaWidth = fieldWidth * areaSize;
        const areaHeight = fieldHeight * areaSize;
        for (let i = 0; i < blocksCount; i++) {
            let particle = new FlyerParticle();
            particle.location = center.add(new Vector2(areaWidth * Math.random() - areaWidth / 2, areaHeight * Math.random() - areaHeight / 2));
            particle.velocity = new Vector2(0, 0);
            particle.size = 20 + maxSize * Math.random() * 20;
            particle.color = Colors.Gray;
            this.blocks.push(particle);
        }

        this.revolution = 20;
        this.grid = this.createGrid(w, h, this.revolution);
        this.offset = new Vector2(0, 0);

        if (this.world.inputs.pointer.position.length === 0) {
            this.world.inputs.pointer.position = new Vector2(w / 2, h / 2);
        }
    }

    update() {
        const rect = {
            width: this.world.width,
            height: this.world.height
        };

        const center = new Vector2(rect.width / 2, rect.height / 2);

        this.grid.clear();

        this.offset = this.getAverateLocation(this.particles).subtract(center);

        //this.allocateGrid(this.grid, this.particles, this.offset, this.revolution);

        let mouse = null;
        if (this.world.inputs.pointer.isPressed) {
            mouse = this.world.inputs.pointer.position.add(this.offset);
        }

        this.flyers.forEach(element => {
            element.update(this.flyers, this.blocks, mouse);
        });

        // this.grid.forEach((cell, x, y) => {
        //     if (cell.length > 0) {
        //         let neighbours = this.grid.neighbours(x, y);
        //         cell.forEach(particle => {
        //             particle.update(neighbours, rect, this.world.inputs.pointer.position);
        //         });
        //     }
        // });
    }

    createGrid(width, height, revolution = 10) {
        let w = Math.ceil(width / revolution);
        let h = Math.ceil(height / revolution);
        return new ArrayGrid(w, h);
    }

    allocateGrid(grid, particles, offset, revolution = 10) {
        particles.forEach(element => {
            let location = this.mapLocation(element.location.subtract(offset), revolution);
            location.x = Math.min(grid.width - 1, Math.max(0, location.x));
            location.y = Math.min(grid.height - 1, Math.max(0, location.y));
            grid.get(location.x, location.y).push(element);
        });
    }

    mapLocation(location, revolution) {
        let x = Math.floor(location.x / revolution);
        let y = Math.floor(location.y / revolution);
        return new Vector2(x, y);
    }

    getAverateLocation(particles) {
        if (particles.length > 0) {
            let sum = new Vector2();
            particles.forEach(element => {
                sum = sum.add(element.location);
            });
            return sum.divide(particles.length);
        }
        return new Vector2();
    }
}

class ParticlesFlyerView extends GameView {
    constructor() {
        super();
        this.rotation = 0;
    }

    render(source, context) {
        Graphics.scaleOffset(context, -1, -1, 1);

        Graphics.hold(context, () => {
            context.translate(-source.offset.x, -source.offset.y);
            this.drawGrid(context, source.world.size, source.offset);
            source.particles.forEach(element => {
                this.drawParticle(context, element);
            });
            source.blocks.forEach(element => {
                this.drawParticle(context, element);
            });
            this.drawInfo(context, source.world.size);
            context.translate(source.offset.x, source.offset.y);
        });

    }

    drawParticle(context, particle) {
        let p = particle.location;
        context.beginPath();
        context.arc(p.x, p.y, particle.size / 2, 0, Math.PI * 2, false);
        context.closePath();
        context.fillStyle = particle.color.rgba;
        context.fill();
    }

    drawGrid(context, size, offset) {
        let split = 20;
        let csize = Math.max(size.width, size.height) / split;
        let cw = Math.ceil(size.width / csize) + 1;
        let ch = Math.ceil(size.height / csize) + 1;

        let ex = Math.ceil(offset.x / csize);
        let ey = Math.ceil(offset.y / csize);
        let ox = ex * csize;
        let oy = ey * csize;

        context.beginPath();
        for (let index = -1; index < cw; index++) {
            let x = index * csize + ox;
            for (let index2 = -1; index2 < ch; index2++) {
                if ((index + index2 + ex + ey) % 2 === 0) {
                    let y = index2 * csize + oy;
                    context.rect(x, y, csize, csize);
                }
            }
        }
        context.closePath();
        context.fillStyle = "rgba(255,255,255,0.05)";
        context.fill();
    }

    drawInfo(context, size) {
        let fonSize = Math.max(size.width / 20, 32);
        context.font = fonSize + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText("Press And Move Pointer!", size.center.x, size.center.y);
    }
}


export {
    ParticlesFlyer,
    ParticlesFlyerView
};