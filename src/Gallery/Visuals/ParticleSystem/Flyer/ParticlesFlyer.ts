import {
    ParticleSystem
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
import { Particle } from "../Particle";

export class ParticlesFlyer extends ParticleSystem<FlyerParticle> {
    clouds: Particle[] = [];
    grid: ArrayGrid;

    offset: Vector2;
    averageLocation: Vector2;
    revolution: number = 200;
    cameraSpeed: number = 0.99;

    flyerFieldWidth: number;
    flyerFieldHeight: number;
    cloudFieldWidth: number;
    cloudFieldHeight: number;

    scaleDelta: number = 0;
    scale: number = 2;

    random: Random = new Random();

    start() {
        const w = this.world.width;
        const h = this.world.height;
        const center = new Vector2(w * 0.5, h * 0.5);

        // Create flyer particles
        const flyersCount = this.random.normal(1, 3);
        const velocity = 10;

        this.flyerFieldWidth = w * 0.8;
        this.flyerFieldHeight = h * 0.8;

        const screen = new Vector2(w, h).length;
        const minSize = Math.max(10, Math.floor(screen / 10));
        const maxSize = Math.min(60, Math.floor(screen / 6));

        this.cameraSpeed = Math.max(0.1, Math.min(1, 0.5 + 1000 / screen));
        console.log(this.cameraSpeed);

        const flyers = this.createFlyers(flyersCount, velocity, center, minSize, maxSize, this.flyerFieldWidth, this.flyerFieldHeight);
        this.particles.push(...flyers);

        // Create clouds
        const cloudsCount = this.random.normal(40, 80);
        const areaSize = 8;
        this.cloudFieldWidth = this.flyerFieldWidth * areaSize;
        this.cloudFieldHeight = this.flyerFieldHeight * areaSize;
        const clouds = this.createClouds(cloudsCount, center, this.cloudFieldWidth, this.cloudFieldHeight);
        this.clouds.push(...clouds);

        // Create grid
        this.grid = this.createGrid(w, h, this.revolution);
        this.offset = new Vector2(0, 0);

        // Initialize mouse position
        if (this.world.inputs.pointer.position.length === 0) {
            this.world.inputs.pointer.position = new Vector2(w / 2, h / 2);
        }
    }

    private createFlyers(flyersCount: number, velocity: number, center: Vector2, minSize: number, maxSize: number, fieldWidth: number, fieldHeight: number) {
        const particles: FlyerParticle[] = [];
        for (let i = 0; i < flyersCount; i++) {
            const particle = new FlyerParticle();
            const x = fieldWidth * (Math.random() - 0.5);
            const y = fieldHeight * (Math.random() - 0.5);
            const vx = velocity * (2 * Math.random() - 1);
            const vy = velocity * (2 * Math.random() - 1);
            particle.location = center.add(new Vector2(x, y));
            particle.velocity = new Vector2(vx, vy);
            particle.size = this.random.normal(minSize, maxSize);
            particle.color = Colors.White;
            particles.push(particle);
        }
        return particles;
    }

    private createClouds(cloudsCount: number, center: Vector2, fieldWidth: number, fieldHeight: number) {
        const particles: Particle[] = [];
        for (let i = 0; i < cloudsCount; i++) {
            const particle = new Particle();
            const x = fieldWidth * (Math.random() - 0.5);
            const y = fieldHeight * (Math.random() - 0.5);
            particle.location = center.add(new Vector2(x, y));
            particle.rotation = Math.random() * Math.PI * 2;
            particle.size = this.random.normal(0.1, 2);
            particle.alpha = 0;
            particle.age = Math.random() > 0.5 ? 0 : 1;
            particles.push(particle);
        }
        return particles;
    }

    update() {
        const center = this.world.center;

        this.averageLocation = ParticleSystem.calcAverageLocation(this.particles)

        const targetLocation = this.averageLocation.multiply(this.scale).subtract(center);
        this.offset = this.offset.add(targetLocation.subtract(this.offset).multiply(this.cameraSpeed));

        let mouse = null;
        if (this.world.inputs.pointer.isPressed) {
            const p = this.offset.add(center).divide(this.scale);
            mouse = this.world.inputs.pointer.position.divide(this.scale).add(p.subtract(center.divide(this.scale)));
        }

        this.particles.forEach(element => {
            element.update(this.particles, mouse);
        });

        // this.grid.clear();
        // this.allocateGrid(this.grid, this.particles, this.offset, this.revolution);
        // this.grid.forEach((cells, x, y) => {
        //     if (cells.length > 0) {
        //         const neighbours = this.grid.neighbours(x, y);
        //         cells.forEach(element => {
        //             element.update(neighbours, mouse);
        //         });
        //     }
        // });

        this.clouds.forEach(element => {
            if (element.alpha < 1) {
                element.alpha += 0.01;
                if (element.alpha >= 0.99) {
                    element.alpha = 1;
                }
            }
            element.rotation += 0.0001;
        })

        this.locateParticles(this.particles, this.cloudFieldWidth, this.cloudFieldHeight);
        this.locateParticles(this.clouds, this.cloudFieldWidth, this.cloudFieldHeight, v => {
            v.alpha = 0;
        });

        this.scaleDelta = (this.scaleDelta + 0.005) % (Math.PI * 2);
        this.scale = 1.5 - Math.sin(this.scaleDelta) * 1;
    }

    private locateParticles<T extends Particle>(particles: T[], width: number, height: number, callback?: (particle: T) => void) {
        const distance = new Vector2(width, height).length;
        particles.forEach(element => {
            if (element.location.subtract(this.averageLocation).length > distance) {
                const x = width * (Math.random() - 0.5);
                const y = height * (Math.random() - 0.5);
                element.location = this.averageLocation.add(new Vector2(x, y));
                callback && callback(element);
            }
        });
    }

    private createGrid(width: number, height: number, revolution = 10) {
        const w = Math.ceil(width / revolution);
        const h = Math.ceil(height / revolution);
        return new ArrayGrid(w, h);
    }

    private allocateGrid<T extends Particle>(grid: ArrayGrid, particles: T[], offset: Vector2, revolution: number) {
        particles.forEach(element => {
            const location = this.mapLocation(element.location.subtract(offset), revolution);
            location.x = Math.min(grid.width - 1, Math.max(0, location.x));
            location.y = Math.min(grid.height - 1, Math.max(0, location.y));
            grid.get(location.x, location.y).push(element);
        });
    }

    private mapLocation(location: Vector2, revolution: number) {
        const x = Math.floor(location.x / revolution);
        const y = Math.floor(location.y / revolution);
        return new Vector2(x, y);
    }
}

export class ParticlesFlyerView<T extends ParticlesFlyer> extends TypedGameView<T> {
    target: T;

    constructor() {
        super();

        // Backgrounds
        this.joint(new GhostLayerView());
        //this.joint(new BackLayerImageView());
        //this.joint(new BackLayerGridView());
        this.joint(new CloudLayerView(0));

        // Main Layer
        // this.joint(new TrailLayerView());
        this.joint(new MainLayerView());

        // Front Layer
        this.joint(new CloudLayerView(1));
        this.joint(new InfoLayerView());
    }

    render(source: T, context: CanvasRenderingContext2D) {
        this.target = source;
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
}

abstract class LayerView extends GameView {
    layer: OffscreenCanvas;

    render(source: ParticlesFlyerView<ParticlesFlyer>, context: CanvasRenderingContext2D) {
        if (!this.layer) {
            this.layer = new OffscreenCanvas(context.canvas.width, context.canvas.height);
        }
        this.layer.draw((innerContext) => {
            Graphics.clear(innerContext).hold(innerContext, () => {
                this.drawLayer(innerContext, source);
            });
        }).output(context, 0, 0);
    }

    abstract drawLayer(context: CanvasRenderingContext2D, source: ParticlesFlyerView<ParticlesFlyer>): void;
}

class GhostLayerView extends LayerView {
    ghost: GhostEffect;

    constructor() {
        super();
        this.ghost = new GhostEffect(new Color(50, 100, 200), 0, false);
    }

    drawLayer(context: CanvasRenderingContext2D, source: ParticlesFlyerView<ParticlesFlyer>) {
        this.ghost.update();
        this.ghost.effect(context);
    }
}

class BackLayerImageView extends LayerView {
    background: HTMLImageElement;

    constructor() {
        super();
        this.background = new Image();
        this.background.src = GalleryImages.Galaxy;
    }

    drawLayer(context: CanvasRenderingContext2D, source: ParticlesFlyerView<ParticlesFlyer>) {
        context.drawImage(this.background, 0, 0);
    }
}

class BackLayerGridView extends LayerView {
    layer: OffscreenCanvas;

    drawLayer(context: CanvasRenderingContext2D, source: ParticlesFlyerView<ParticlesFlyer>) {
        const offset = source.target.offset;
        context.translate(-offset.x, -offset.y);
        this.drawGrid(context, source.target.world.size, offset, source.target.scale);
        context.translate(offset.x, offset.y);
    }

    private drawGrid(context: CanvasRenderingContext2D, size: any, offset: Vector2, scale: number = 1) {
        const split = 1;
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

class TrailLayerView extends LayerView {
    layer: OffscreenCanvas;

    drawLayer(context: CanvasRenderingContext2D, source: ParticlesFlyerView<ParticlesFlyer>) {
        Graphics.clear(context);

        const offset = source.target.offset;
        context.translate(-offset.x, -offset.y);
        source.target.particles.forEach(element => {
            this.drawBirdTrail(context, element, source.target.scale);
        });
        context.translate(offset.x, offset.y);
    }

    private drawBirdTrail(context: CanvasRenderingContext2D, particle: FlyerParticle, scale: number) {
        Graphics.hold(context, () => {
            const history = [...particle.history, particle.trail];
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
        this.bird.src = "../static/plane.png" || GalleryImages.Plane;
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

                real.particles.forEach(element => {
                    this.drawBirdImage(innerContext, element, real.scale, source);
                });

                innerContext.translate(offset.x, offset.y);
            });
        }).output(context, 0, 0);

        // this.cache.draw((innerContext) => {
        //     Graphics.clear(innerContext);
        //     innerContext.globalAlpha = 0.8;
        //     innerContext.drawImage(this.mainLayer.canvas, 0, 0);
        // });
    }

    private drawBirdImage(context: CanvasRenderingContext2D, particle: FlyerParticle, scale: number, source: ParticlesFlyerView<ParticlesFlyer>) {
        const p = particle.location.multiply(scale);
        const v = particle.velocity;
        const size = particle.size * scale;
        const sizeHalf = size / 2

        Graphics.hold(context, () => {
            context.translate(p.x, p.y);
            context.rotate(Math.atan2(v.y, v.x) + Math.PI / 2);
            context.translate(-p.x, -p.y);
            context.drawImage(this.bird, p.x - sizeHalf, p.y - sizeHalf, size, size);
            context.globalCompositeOperation = "destination-out";
            context.fillStyle = `rgba(0,0,0,${0.5 - source.target.scale * 0.2})`
            context.fillRect(p.x - sizeHalf, p.y - sizeHalf, size, size);
            context.globalCompositeOperation = "source-atop";
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

class CloudLayerView extends LayerView {
    cloud: HTMLImageElement;
    allowAge: number = 0;

    constructor(allowAge: number) {
        super();
        this.allowAge = allowAge;
        this.cloud = new Image();
        this.cloud.src = GalleryImages.Cloud;;
    }

    drawLayer(context: CanvasRenderingContext2D, source: ParticlesFlyerView<ParticlesFlyer>) {
        const offset = source.target.offset;
        context.translate(-offset.x, -offset.y);
        source.target.clouds.filter(v => v.age === this.allowAge).forEach(element => {
            this.drawCloudImage(context, element, source.target.scale);
        });
        context.translate(offset.x, offset.y);
    }

    private drawCloudImage(context: CanvasRenderingContext2D, particle: Particle, scale: number) {
        const p = particle.location.multiply(scale);
        Graphics.hold(context, () => {
            context.globalAlpha = particle.alpha;
            context.translate(p.x, p.y);
            context.rotate(particle.rotation);
            context.translate(-p.x, -p.y);
            context.drawImage(this.cloud, p.x, p.y, this.cloud.width * scale, this.cloud.height * scale);
        });
    }
}

class InfoLayerView extends LayerView {
    drawLayer(context: CanvasRenderingContext2D, source: ParticlesFlyerView<ParticlesFlyer>) {
        const offset = source.target.offset;
        context.translate(-offset.x, -offset.y);
        this.drawInfo(context, source.target.world.size, source.target.scale);
        context.translate(offset.x, offset.y);
    }

    private drawInfo(context: CanvasRenderingContext2D, size: any, scale: number) {
        const fonSize = Math.max(size.height / 2 * scale);
        context.font = fonSize + "px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#FFF";
        context.fillText("JUST FLY", size.center.x * scale, size.center.y * scale);
    }
}