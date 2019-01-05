import {
    ParticlesBase
} from "../ParticleSystem";
import {
    Random
} from "../../../../Engine/Numerics/Random";
import {
    GhostEffect, GhostImageEffect
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

export class ParticlesFlyer extends ParticlesBase<FlyerParticle> {
    blocks: FlyerParticle[] = [];
    grid: ArrayGrid;

    offset: Vector2;
    average: Vector2;
    revolution: number = 200;

    fieldWidth: number;
    fieldHeight: number;
    areaWidth: number;
    areaHeight: number;

    scaleDelta: number = 0;
    scale: number = 2;

    random: Random = new Random();

    start() {
        const w = this.world.width;
        const h = this.world.height;
        const center = new Vector2(w * 0.5, h * 0.5);

        const screen = new Vector2(w, h).length;
        const flyersCount = 12; // Math.floor(screen / 32) / 4;
        const maxSize = Math.floor(screen / 60);
        this.fieldWidth = w * 0.8;
        this.fieldHeight = h * 0.8;

        // Create particles
        for (let i = 0; i < flyersCount; i++) {
            const particle = new FlyerParticle();
            particle.location = center.add(new Vector2(this.fieldWidth * Math.random() - this.fieldWidth / 2, this.fieldHeight * Math.random() - this.fieldHeight / 2));
            particle.velocity = new Vector2(10 * Math.random() - 5, 10 * Math.random() - 5);
            particle.size = this.random.normal(10, 10 + maxSize);
            particle.color = Colors.White;
            this.particles.push(particle);
        }

        const blocksCount = 5;
        const areaSize = 4;
        this.areaWidth = this.fieldWidth * areaSize;
        this.areaHeight = this.fieldHeight * areaSize;

        // Create blocks
        for (let i = 0; i < blocksCount; i++) {
            const particle = new FlyerParticle();
            particle.location = center.add(new Vector2(this.areaWidth * Math.random() - this.areaWidth / 2, this.areaHeight * Math.random() - this.areaHeight / 2));
            particle.velocity = new Vector2(0, 0);
            particle.age = 20 + maxSize * Math.random() * 20;
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
        const target = this.average.multiply(this.scale).subtract(center);
        this.offset = this.offset.add(target.subtract(this.offset).multiply(0.1));
        //this.grid.clear();
        //this.allocateGrid(this.grid, this.particles, this.offset, this.revolution);

        let mouse = null;
        if (this.world.inputs.pointer.isPressed) {
            mouse = this.world.inputs.pointer.position.add(this.average.subtract(center));
        }

        this.particles.forEach(element => {
            element.update(this.particles, this.blocks, mouse);
        });

        //this.locateParticles(this.particles);
        this.locateParticles(this.blocks);


        // this.grid.forEach((cell, x, y) => {
        //     if (cell.length > 0) {
        //         let neighbours = this.grid.neighbours(x, y);
        //         cell.forEach(particle => {
        //             particle.update(neighbours, [], mouse);
        //         });
        //     }
        // });

        this.scaleDelta = (this.scaleDelta + 0.002) % (Math.PI * 2);
        this.scale = 2 + Math.sin(this.scaleDelta) * 1.5;
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
            if (element.size < element.age) {
                element.size += 1;
            }
            if (element.location.subtract(this.average).length > distance) {
                element.size = 1;
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
        //this.joint(new GhostLayerView());
        this.joint(new BackLayerView());
        //this.joint(new SmokeLayerView());
        this.joint(new MainLayerView());
        //this.joint(new InfoLayerView());
    }

    render(source: T, context: CanvasRenderingContext2D) {
        this.target = source;
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
}

class GhostLayerView extends GameView {
    ghost: GhostEffect;
    layer: OffscreenCanvas;

    constructor() {
        super();
        this.ghost = new GhostEffect(new Color(0, 0, 255, 0.1), 10, false);
    }

    render(source: ParticlesFlyerView<ParticlesFlyer>, context: CanvasRenderingContext2D) {
        if (!this.layer) {
            this.layer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }
        this.layer.draw((innerContext) => {
            this.ghost.update();
            this.ghost.effect(context);
        }).output(context, 0, 0);
    }
}

class BackLayerView extends GameView {
    clound: HTMLImageElement;
    layer: OffscreenCanvas;

    constructor() {
        super();
        //this.clound = new Image();
        //this.clound.src = "../static/back.jpg";
    }

    render(source: ParticlesFlyerView<ParticlesFlyer>, context: CanvasRenderingContext2D) {
        if (!this.layer) {
            this.layer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        const real = source.target;
        this.layer.draw((innerContext) => {
            const offset = real.offset;
            Graphics.clear(innerContext).hold(innerContext, () => {
                //innerContext.drawImage(this.clound, 0, 0);
                innerContext.translate(-offset.x, -offset.y);
                this.drawGrid(innerContext, real.world.size, offset, real.scale);
                innerContext.translate(offset.x, offset.y);
            });
        }).output(context, 0, 0);
    }

    private drawGrid(context: CanvasRenderingContext2D, size, offset: Vector2, scale = 1) {
        const split = 20;
        const csize = Math.max(size.width, size.height) / split * scale;
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

class SmokeLayerView extends GameView {
    layer: OffscreenCanvas;

    render(source: ParticlesFlyerView<ParticlesFlyer>, context: CanvasRenderingContext2D) {
        if (!this.layer) {
            this.layer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        const real = source.target;
        this.layer.draw((innerContext) => {
            Graphics.clear(innerContext);
            Graphics.hold(innerContext, (innerContext) => {
                const offset = real.offset;
                innerContext.translate(-offset.x, -offset.y);
                real.particles.forEach(element => {
                    this.drawBirdSmoke(innerContext, element, real.scale);
                });
                innerContext.translate(offset.x, offset.y);
            });
        }).output(context, 0, 0);
    }

    private drawBirdSmoke(context: CanvasRenderingContext2D, particle: FlyerParticle, scale) {
        Graphics.hold(context, () => {
            const history = [...particle.history, particle.location];
            const length = history.length;
            if (length > 1) {
                for (let index = 1; index < length; index++) {
                    const pre = history[index - 1].multiply(scale);
                    const cur = history[index].multiply(scale);
                    context.beginPath();
                    context.moveTo(pre.x, pre.y);
                    context.lineTo(cur.x, cur.y);
                    context.closePath();
                    context.lineWidth = (1 + (particle.size * scale / 10)) * (index / length);
                    context.strokeStyle = new Color(255, 255, 255, index / length * 0.8).rgba;
                    context.stroke();
                }
            }
        });
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
    }

    render(source: ParticlesFlyerView<ParticlesFlyer>, context: CanvasRenderingContext2D) {
        if (!this.mainLayer) {
            this.mainLayer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
            this.cache = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        const real = source.target;
        this.mainLayer.draw((innerContext) => {
            Graphics.clear(innerContext).hold(innerContext, (innerContext) => {
                //real.effects.ghost.effect(innerContext);
                innerContext.drawImage(this.cache.canvas, 0, 0);

                const offset = real.offset;
                innerContext.translate(-offset.x, -offset.y);
                real.blocks.forEach(element => {
                    this.drawBlocks(innerContext, element, real.scale);
                });
                real.particles.forEach(element => {
                    this.drawBirdImage(innerContext, element, real.scale);
                });
                innerContext.translate(offset.x, offset.y);
            });
        }).output(context, 0, 0);

        this.cache.draw((innerContext) => {
            Graphics.clear(innerContext);
            innerContext.globalAlpha = 0.4;
            innerContext.drawImage(this.mainLayer.canvas, 0, 0);
        });
    }

    private drawBlocks(context: CanvasRenderingContext2D, particle: FlyerParticle, scale) {
        const p = particle.location.multiply(scale);
        const size = particle.size * scale;
        context.beginPath();
        context.arc(p.x, p.y, size / 2, 0, Math.PI * 2, false);
        context.closePath();
        context.strokeStyle = particle.color.rgba;
        context.stroke();
    }

    private drawBirdImage(context: CanvasRenderingContext2D, particle: FlyerParticle, scale) {
        const p = particle.location.multiply(scale);
        const v = particle.velocity;
        const a = particle.acceleration;
        const size = particle.size * scale;
        const sizeHalf = size / 2

        Graphics.hold(context, () => {
            const history = [...particle.history, particle.location];
            const length = history.length;
            if (length > 1) {
                for (let index = 1; index < length; index++) {
                    const pre = history[index - 1].multiply(scale);
                    const cur = history[index].multiply(scale);
                    context.beginPath();
                    context.moveTo(pre.x, pre.y);
                    context.lineTo(cur.x, cur.y);
                    context.closePath();
                    context.lineWidth = (1 + (particle.size * scale / 10)) * (index / length);
                    context.strokeStyle = new Color(255, 255, 255, index / length * 0.8).rgba;
                    context.stroke();
                }
            }
        });

        Graphics.hold(context, () => {
            context.translate(p.x, p.y);
            context.rotate(Math.atan2(v.y, v.x) + Math.PI / 2);
            context.translate(-p.x, -p.y);

            context.drawImage(this.bird, p.x - sizeHalf, p.y - sizeHalf, size, size);
            //this.drawText(context, particle.emoji, p, sizeHalf);
        });
    }

    private drawText(context: CanvasRenderingContext2D, text: string, location: Vector2, size: number) {
        context.font = Math.round(size) + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText(text, location.x, location.y);
    }
}

class InfoLayerView extends GameView {
    layer: OffscreenCanvas;

    render(source: ParticlesFlyerView<ParticlesFlyer>, context: CanvasRenderingContext2D) {
        if (!this.layer) {
            this.layer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }

        const real = source.target;
        this.layer.draw((innerContext) => {
            Graphics.clear(innerContext).hold(innerContext, () => {
                this.drawInfo(innerContext, real.world.size, real.scale);
            });
        }).output(context, 0, 0);
    }

    private drawInfo(context: CanvasRenderingContext2D, size, scale) {
        const fonSize = Math.max(size.width / 20, 32);
        context.font = fonSize + "px Arial";
        context.textAlign = "center";
        context.fillStyle = "#FFF";
        context.fillText("Just Fly", size.center.x, size.center.y);
    }
}