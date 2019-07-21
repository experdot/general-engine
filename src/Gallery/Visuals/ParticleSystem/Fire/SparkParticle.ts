import { Particle } from "../Particle";

function rand(min, max) { return Math.random() * (max - min) + min; };

export class SparkParticle extends Particle {
    cx: number;
    cy: number;
    x: number;
    y: number;
    lx: number;
    ly: number;
    vx: number;
    vy: number;
    life: number;
    r: number;
    alive: boolean;
    c: { h: number, s: number, l: number; a: number };

    constructor(mouse) {
        super();
        this.cx = mouse.x;
        this.cy = mouse.y;
        this.x = rand(this.cx - 40, this.cx + 40);
        this.y = rand(this.cy, this.cy + 5);
        this.lx = this.x;
        this.ly = this.y;
        this.vy = rand(-1, 3);
        this.vx = rand(-4, 4);
        this.r = rand(0, 1);
        this.life = rand(4, 5) * 2;
        this.alive = true;
        this.c = {
            h: Math.floor(rand(2, 40)),
            s: 100,
            l: rand(40, 100),
            a: rand(0.8, 0.9)
        }
    }

    update() {
        this.lx = this.x;
        this.ly = this.y;

        this.y -= this.vy;
        this.x += this.vx;

        if (this.x < this.cx)
            this.vx += 0.2;
        else
            this.vx -= 0.2;

        this.vy += 0.08;
        this.life -= 0.1;

        if (this.life <= 0) {
            this.c.a -= 0.05;
            if (this.c.a <= 0)
                this.alive = false;

        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.lx, this.ly);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + (this.c.a / 2) + ")";
        ctx.lineWidth = this.r;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.lx, this.ly);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + this.c.a + ")";
        ctx.lineWidth = this.r;
        ctx.stroke();
        ctx.closePath();
    }
}