import {
    Color,
    ColorHelper
} from "../../../../Fundamental/Color";
import {
    Vector2
} from "../../../../Fundamental/Vector";
import {
    Random
} from "../../../../Fundamental/Random";
import {
    ParticlesBase
} from "../ParticleSystem";
import {
    GameView
} from "../../../Core/GameObject/GameView";
import {
    FlyerParticle
} from "../Particle/FlyerParticle";

class ParticlesFlyer extends ParticlesBase {
    constructor(view) {
        super(view);
        this.random = new Random();
        this.fillColor = new Color(0, 0, 0, 0.005);
        this.view.render.next(context => {
            context.fillStyle = this.fillColor.getRGBAValue();
            context.fillRect(0, 0, this.world.width, this.world.height);
        }, 0);
        this.offsetX = [0, -1, 0, 1, 1, 1, 0, -1, -1];
        this.offsetY = [0, -1, -1, -1, 0, 1, 1, 1, 0];

        this.start.next(this._start);
        this.update.next(this._update);
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
            particle.color = Color.White();
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

        this.clearGrid(this.grid);
        this.allocateGrid(this.grid, this.particles, this.revolution);

        this.grid.forEach(element => {
            element.forEach(cell => {
                if (cell.length > 0) {
                    let neighbours = this.getGridNeighbours(this.grid, cell[0], this.revolution);
                    cell.forEach(particle => {
                        particle.update(neighbours, rect, this.world.inputs.pointer.position);
                    });
                }
            });
        });

        // this.flyers.forEach((element) => {
        //     let neighbours = this.getGridNeighbours(this.grid, element, this.revolution);
        //     element.update(neighbours, rect, this.world.inputs.pointer.position);
        // });

        if (Math.random() > 0.5) {
            this.fillColor = ColorHelper.getGradientRandomColor(this.fillColor, 40);
        }
    }

    createGrid(width, height, revolution = 10) {
        let w = Math.ceil(width / revolution);
        let h = Math.ceil(height / revolution);
        let grid = [];
        for (let i = 0; i < w; i++) {
            grid[i] = [];
            for (let j = 0; j < h; j++) {
                grid[i][j] = [];
            }
        }
        return grid;
    }

    clearGrid(grid) {
        grid.forEach(element => {
            element.forEach(cell => {
                cell.splice(0, cell.length);
            });
        });
    }

    allocateGrid(grid, particles, revolution = 10) {
        particles.forEach(element => {
            let p = element.location.divide(revolution);
            let x = Math.floor(p.x);
            let y = Math.floor(p.y);
            grid[x][y].push(element);
        });
    }

    getGridNeighbours(grid, particle, revolution) {
        let result = [];
        let w = grid.length;
        let h = grid[0].length;
        let p = particle.location.divide(revolution);
        let x = Math.floor(p.x);
        let y = Math.floor(p.y);
        for (let i = 0; i < 9; i++) {
            let dx = x + this.offsetX[i];
            let dy = y + this.offsetY[i];
            if (dx >= 0 && dx < w && dy >= 0 && dy < h) {
                result.push(...grid[dx][dy]);
            }
        }
        return result;
    }
}

class ParticlesFlyerView extends GameView {
    constructor(target, scale = 1) {
        super(target);
        this.scale = scale;
        this.image = new Image(16, 16);
        this.image.src = "/static/sample.png";
        this.rotation = 0;
        this.rotation2 = 0;
    }

    draw(context) {
        if (this.target.stopDraw) {
            return;
        }

        this.rotation2 = this.rotation2 + 0.002;
        this.scaleCanvas(context, 16 * Math.sin(this.rotation2));

        for (let index = 0; index < this.target.particles.length; index++) {
            const element = this.target.particles[index];
            let p = element.location;

            context.beginPath();
            context.arc(p.x, p.y, element.size / 2 * this.scale, 0, Math.PI * 2, false);
            context.fillStyle = element.color.getRGBAValue();
            context.fill();

            // let v = element.velocity;
            // let t = p.add(v);
            // context.beginPath();
            // context.moveTo(p.x, p.y);
            // context.lineTo(t.x, t.y);
            // context.lineWidth = 4 * this.scale;
            // context.strokeStyle = element.color.getRGBAValue();
            // context.closePath();
            // context.stroke();

            // let v = element.velocity;
            // context.translate(p.x, p.y);
            // context.rotate(Math.atan2(v.y, v.x));
            // let s = element.size;
            // context.globalAlpha = element.color.a;
            // context.drawImage(this.image, -s / 2, -s / 2, s, s);
            // context.globalAlpha = 1;
            // context.setTransform(1, 0, 0, 1, 0, 0);

            // let n = element.neighbour;
            // if (n) {
            //     let t = n.location;
            //     context.beginPath();
            //     context.moveTo(p.x, p.y);
            //     context.lineTo(t.x, t.y);
            //     context.lineWidth = 2 * this.scale;
            //     context.strokeStyle = element.color.getRGBAValue();
            //     context.closePath();
            //     context.stroke();
            // }F
        }
    }

    scaleCanvas(context, offset = 1) {
        this.rotation = this.rotation + 0.0005;

        let w = this.target.world.width + offset;
        let h = this.target.world.height + offset;
        context.translate(this.target.world.width / 2, this.target.world.height / 2);
        //context.rotate(this.rotation);
        context.globalAlpha = 0.99;
        context.drawImage(document.getElementById("canvas"), -w / 2, -h / 2, w, h);
        context.globalAlpha = 1;
        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}


export {
    ParticlesFlyer,
    ParticlesFlyerView
};