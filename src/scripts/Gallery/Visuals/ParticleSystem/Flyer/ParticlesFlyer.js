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
    Graphics
} from "../../../../Engine/Drawing/Graphics";
import {
    GameView
} from "../../../../Engine/Game/GameObject/GameView";
import {
    FlyerParticle
} from "./FlyerParticle";
import { OffscreenCanvas } from "../../../../Engine/Drawing/OffscreenCanvas";
import { GalleryImages } from "../../../Resources/GalleryImages";

class ParticlesFlyer extends ParticlesBase {
    constructor() {
        super();
        this.random = new Random();
        this.ghost = new GhostEffect(new Color(0, 0, 255, 0.1), 10, false);
        this.joint(this.ghost);
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
            particle.size = this.random.normal(10, 10 + maxSize);
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

        this.revolution = 200;
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

        this.offset = this.getAverateLocation(this.particles).subtract(center);

        //this.grid.clear();
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
        //             particle.update(neighbours, [], mouse);
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

        this.joint(new BackLayerView());
        this.joint(new MainLayerView());
    }

    render(source, context) {
        this.target = source;
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
}


class BackLayerView extends GameView {
    render(source, context) {
        if (!this.backLayer) {
            this.backLayer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        source = source.target;

        this.backLayer.draw((innerContext) => {
            Graphics.clear(innerContext).hold(innerContext, () => {
                innerContext.translate(-source.offset.x, -source.offset.y);
                this.drawGrid(innerContext, source.world.size, source.offset);
                innerContext.translate(source.offset.x, source.offset.y);
            });
        }).output(context, 0, 0);
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

        context.fillStyle = "rgba(0,0,0,0.05)";
        context.fill();
    }
}

class MainLayerView extends GameView {
    constructor() {
        super();
        this.bird = new Image(128, 128);
        this.bird.src = GalleryImages.Bird;

        //this.clound = new Image();
        //this.clound.src = "../static/clound.png";
    }

    render(source, context) {
        if (!this.mainLayer) {
            this.mainLayer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
            this.cache = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        source = source.target;

        this.mainLayer.draw((innerContext) => {

            Graphics.clear(innerContext).hold(innerContext, (innerContext) => {

                source.ghost.effect(innerContext);

                innerContext.drawImage(this.cache.canvas, 0, 0);

                context.globalAlpha = 0.1;
                context.drawImage(this.mainLayer.canvas, 0, 0);
                context.globalAlpha = 1;

                innerContext.translate(-source.offset.x, -source.offset.y);

                source.particles.forEach(element => {
                    this.drawBirdImage(innerContext, element);
                    //this.drawParticle(context, element);
                });

                this.drawInfo(innerContext, source.world.size);

                //context.drawImage(this.clound, 0, 0);

                innerContext.translate(source.offset.x, source.offset.y);
            });
        }).output(context, 0, 0);

        this.cache.draw((innerContext) => {
            Graphics.clear(innerContext);
            innerContext.globalAlpha = 0.6;
            innerContext.drawImage(this.mainLayer.canvas, 0, 0);
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

    drawBirdImage(context, particle) {
        let p = particle.location;
        let v = particle.velocity;
        let size = particle.size / 2;
        let size2 = size * 2;
        Graphics.hold(context, () => {
            context.translate(p.x, p.y);
            context.rotate(Math.atan2(v.y, v.x) + Math.PI / 2);
            context.translate(-p.x, -p.y);
            context.drawImage(this.bird, p.x - size, p.y - size, size2, size2);
        });
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