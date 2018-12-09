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
    GameView, TypedGameView
} from "../../../../Engine/Game/GameObject/GameView";
import {
    FlyerParticle
} from "./FlyerParticle";
import { OffscreenCanvas } from "../../../../Engine/Drawing/OffscreenCanvas";
import { GalleryImages } from "../../../Resources/GalleryImages";

export class ParticlesFlyer extends ParticlesBase {
    flyers: FlyerParticle[] = [];
    blocks: FlyerParticle[] = [];
    grid: ArrayGrid;

    offset: Vector2;
    average: Vector2;
    revolution: number = 200;

    fieldWidth: number;
    fieldHeight: number;
    areaWidth: number;
    areaHeight: number;

    ghost: GhostEffect;
    random: Random = new Random();

    constructor() {
        super();
        this.ghost = new GhostEffect(new Color(0, 0, 255, 0.1), 10, false);
        this.joint(this.ghost);
    }

    start() {
        const w = this.world.width;
        const h = this.world.height;
        const center = new Vector2(w * 0.5, h * 0.5);

        const screen = new Vector2(w, h).length;
        const flyersCount = Math.floor(screen / 16) / 3;
        const maxSize = Math.floor(screen / 60);
        this.fieldWidth = w * 0.8;
        this.fieldHeight = h * 0.8;

        // Create flyers
        for (let i = 0; i < flyersCount; i++) {
            const particle = new FlyerParticle();
            particle.location = center.add(new Vector2(this.fieldWidth * Math.random() - this.fieldWidth / 2, this.fieldHeight * Math.random() - this.fieldHeight / 2));
            particle.velocity = new Vector2(10 * Math.random() - 5, 10 * Math.random() - 5);
            particle.size = this.random.normal(10, 10 + maxSize);
            particle.color = Colors.White;
            this.flyers.push(particle);
        }
        this.particles = this.flyers;

        const blocksCount = 5;
        const areaSize = 2;
        this.areaWidth = this.fieldWidth * areaSize;
        this.areaHeight = this.fieldHeight * areaSize;

        // Create blocks
        for (let i = 0; i < blocksCount; i++) {
            const particle = new FlyerParticle();
            particle.location = center.add(new Vector2(this.areaWidth * Math.random() - this.areaWidth / 2, this.areaHeight * Math.random() - this.areaHeight / 2));
            particle.velocity = new Vector2(0, 0);
            particle.size = 20 + maxSize * Math.random() * 20;
            particle.color = Colors.Gray;
            this.blocks.push(particle);
        }

        // Create grid
        this.grid = this.createGrid(w, h, this.revolution);
        this.offset = new Vector2(0, 0);

        if (this.world.inputs.pointer.position.length === 0) {
            this.world.inputs.pointer.position = new Vector2(w / 2, h / 2);
        }
    }

    update() {
        const size = this.world.size;
        const center = new Vector2(size.width / 2, size.height / 2);

        this.average = this.getAverateLocation(this.particles)
        this.offset = this.average.subtract(center);

        //this.grid.clear();
        //this.allocateGrid(this.grid, this.particles, this.offset, this.revolution);

        let mouse = null;
        if (this.world.inputs.pointer.isPressed) {
            mouse = this.world.inputs.pointer.position.add(this.offset);
        }

        this.flyers.forEach(element => {
            element.update(this.flyers, this.blocks, mouse);
        });

        //this.locateParticles(this.flyers);
        this.locateParticles(this.blocks);


        // this.grid.forEach((cell, x, y) => {
        //     if (cell.length > 0) {
        //         let neighbours = this.grid.neighbours(x, y);
        //         cell.forEach(particle => {
        //             particle.update(neighbours, [], mouse);
        //         });
        //     }
        // });
    }

    private createGrid(width, height, revolution = 10) {
        const w = Math.ceil(width / revolution);
        const h = Math.ceil(height / revolution);
        return new ArrayGrid(w, h);
    }

    private allocateGrid(grid, particles, offset, revolution = 10) {
        particles.forEach(element => {
            const location = this.mapLocation(element.location.subtract(offset), revolution);
            location.x = Math.min(grid.width - 1, Math.max(0, location.x));
            location.y = Math.min(grid.height - 1, Math.max(0, location.y));
            grid.get(location.x, location.y).push(element);
        });
    }

    private mapLocation(location, revolution) {
        const x = Math.floor(location.x / revolution);
        const y = Math.floor(location.y / revolution);
        return new Vector2(x, y);
    }

    private getAverateLocation(particles) {
        if (particles.length > 0) {
            let sum = new Vector2();
            particles.forEach(element => {
                sum = sum.add(element.location);
            });
            return sum.divide(particles.length);
        }
        return new Vector2();
    }

    private locateParticles(particles: FlyerParticle[]) {
        const distance = new Vector2(this.fieldWidth, this.fieldHeight).length;
        particles.forEach(element => {
            if (element.location.subtract(this.average).length > distance) {
                element.location = this.average.add(new Vector2(
                    this.areaWidth * Math.random() - this.areaWidth / 2,
                    this.areaHeight * Math.random() - this.areaHeight / 2)
                );
            }
        });
    }
}

export class ParticlesFlyerView<T extends ParticlesFlyer> extends TypedGameView<T> {
    target: T;

    constructor() {
        super();

        this.joint(new BackLayerView());
        this.joint(new MainLayerView());
    }

    render(source: T, context: CanvasRenderingContext2D) {
        this.target = source;
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
}


class BackLayerView extends GameView {
    backLayer: OffscreenCanvas;

    render(source: ParticlesFlyerView<ParticlesFlyer>, context: CanvasRenderingContext2D) {
        if (!this.backLayer) {
            this.backLayer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        const realSource = source.target;

        this.backLayer.draw((innerContext) => {
            Graphics.clear(innerContext).hold(innerContext, () => {
                innerContext.translate(-realSource.offset.x, -realSource.offset.y);
                this.drawGrid(innerContext, realSource.world.size, realSource.offset);
                innerContext.translate(realSource.offset.x, realSource.offset.y);
            });
        }).output(context, 0, 0);
    }

    private drawGrid(context: CanvasRenderingContext2D, size, offset: Vector2) {
        const split = 20;
        const csize = Math.max(size.width, size.height) / split;
        const cw = Math.ceil(size.width / csize) + 1;
        const ch = Math.ceil(size.height / csize) + 1;

        const ex = Math.ceil(offset.x / csize);
        const ey = Math.ceil(offset.y / csize);
        const ox = ex * csize;
        const oy = ey * csize;

        context.beginPath();
        for (let index = -1; index < cw; index++) {
            const x = index * csize + ox;
            for (let index2 = -1; index2 < ch; index2++) {
                if ((index + index2 + ex + ey) % 2 === 0) {
                    const y = index2 * csize + oy;
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
    bird: HTMLImageElement;
    cache: OffscreenCanvas;
    mainLayer: OffscreenCanvas;

    constructor() {
        super();
        this.bird = new Image(128, 128);
        this.bird.src = GalleryImages.Bird;

        //this.clound = new Image();
        //this.clound.src = "../static/clound.png";
    }

    render(source: ParticlesFlyerView<ParticlesFlyer>, context: CanvasRenderingContext2D) {
        if (!this.mainLayer) {
            this.mainLayer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
            this.cache = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        const realSource = source.target;

        this.mainLayer.draw((innerContext) => {
            Graphics.clear(innerContext).hold(innerContext, (innerContext) => {
                realSource.ghost.effect(innerContext);

                innerContext.drawImage(this.cache.canvas, 0, 0);

                context.globalAlpha = 0.1;
                context.drawImage(this.mainLayer.canvas, 0, 0);
                context.globalAlpha = 1;

                innerContext.translate(-realSource.offset.x, -realSource.offset.y);

                // Draw blocks
                realSource.blocks.forEach(element => {
                    this.drawBlocks(innerContext, element);
                });

                // Draw birds
                realSource.flyers.forEach(element => {
                    this.drawBirdImage(innerContext, element);
                });

                Graphics.shadow(innerContext, 3, "rgba(0,0,0,0.38)", 3, 3, () => {
                    this.drawInfo(innerContext, realSource.world.size);
                });

                //context.drawImage(this.clound, 0, 0);

                innerContext.translate(realSource.offset.x, realSource.offset.y);
            });
        }).output(context, 0, 0);

        this.cache.draw((innerContext) => {
            Graphics.clear(innerContext);
            innerContext.globalAlpha = 0.6;
            innerContext.drawImage(this.mainLayer.canvas, 0, 0);
        });
    }

    private drawBlocks(context: CanvasRenderingContext2D, particle: FlyerParticle) {
        const p = particle.location;
        context.beginPath();
        context.arc(p.x, p.y, particle.size / 2, 0, Math.PI * 2, false);
        context.closePath();
        context.strokeStyle = particle.color.rgba;
        context.stroke();
    }

    private drawBirdImage(context: CanvasRenderingContext2D, particle: FlyerParticle) {
        const p = particle.location;
        const v = particle.velocity;
        const size = particle.size / 2;
        const size2 = size * 2;
        Graphics.hold(context, () => {
            context.translate(p.x, p.y);
            context.rotate(Math.atan2(v.y, v.x) + Math.PI / 2);
            context.translate(-p.x, -p.y);
            context.drawImage(this.bird, p.x - size, p.y - size, size2, size2);
        });
    }

    private drawInfo(context: CanvasRenderingContext2D, size) {
        const fonSize = Math.max(size.width / 20, 32);
        context.font = fonSize + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText("Press And Move Pointer!", size.center.x, size.center.y);
    }
}