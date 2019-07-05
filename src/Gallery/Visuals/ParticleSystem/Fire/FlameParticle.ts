import { Particle } from "../Particle";

function rand(min, max) { return Math.random() * (max - min) + min; };


export class FlameParticle extends Particle {
    cx: number;
    cy: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    r: number;
    alive: boolean;
    c: { h: number, s: number, l: number; a: number, ta: number };

    constructor(mouse: any) {
        super();
        this.cx = mouse.x;
        this.cy = mouse.y;
        this.x = rand(this.cx - 25, this.cx + 25);
        this.y = rand(this.cy - 5, this.cy + 5);
        this.vy = rand(1, 3);
        this.vx = rand(-1, 1);
        this.r = rand(20, 30);
        this.life = rand(3, 6);
        this.alive = true;
        this.c = {
            h: Math.floor(rand(2, 40)),
            s: 100,
            l: rand(80, 100),
            a: 0,
            ta: rand(0.8, 0.9)
        }
    }

    update() {
        this.y -= this.vy;

        this.vy += 0.05;

        this.x += this.vx;

        if (this.x < this.cx) {
            this.vx += 0.1;
        }
        else
            this.vx -= 0.1;

        if (this.r > 0)
            this.r -= 0.1;

        if (this.r <= 0)
            this.r = 0;


        this.life -= 0.15;

        if (this.life <= 0) {

            this.c.a -= 0.05;

            if (this.c.a <= 0)
                this.alive = false;

        } else if (this.life > 0 && this.c.a < this.c.ta) {
            this.c.a += .08;
        }

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 3, 0, 2 * Math.PI);
        ctx.fillStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + (this.c.a / 20) + ")";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "hsla( " + this.c.h + ", " + this.c.s + "%, " + this.c.l + "%, " + this.c.a + ")";
        ctx.fill();
    }

}