import {
    Color
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
        this.fillColor = new Color(0, 0, 0, 0.01);
        this.view.renderProcess.next(context => {
            context.fillStyle = this.fillColor.getRGBAValue();
            context.fillRect(0, 0, this.world.width, this.world.height);
        }, 0);
    }

    start() {
        let w = this.world.width;
        let h = this.world.height;
        let center = new Vector2(w * 0.5, h * 0.5);
        this.flyers = [];

        const screen = new Vector2(w, h).length();
        const flyersCount = parseInt(screen / 15);
        const maxSize = parseInt(screen / 15);
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
    }

    update() {
        const rect = {
            width: this.world.width,
            height: this.world.height
        };

        this.flyers.forEach((element) => {
            element.update(this.flyers, rect, this.world.inputs.pointer.position);
        });

        // if (Math.random() > 0.5) {
        //     this.fillColor = ColorHelper.getGradientRandomColor(this.fillColor, 40);
        // }
    }
}

class ParticlesFlyerView extends GameView {
    constructor(target, scale = 1) {
        super(target);
        this.scale = scale;
        // this.image = new Image(16, 16);
        // this.image.src = "/static/sample.png";
        this.rotation = 0;
    }

    draw(context) {
        if (this.target.stopDraw) {
            return;
        }

        this.rotation = this.rotation + 0.0001;

        let w = this.target.world.width - 8;
        let h = this.target.world.height - 8;
        context.translate(this.target.world.width / 2, this.target.world.height / 2);
        //context.rotate(this.rotation);
        context.globalAlpha = 0.96;
        context.drawImage(document.getElementById("canvas"), -w / 2, -h / 2, w, h);
        context.globalAlpha = 1;
        context.setTransform(1, 0, 0, 1, 0, 0);

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
            // }
        }
    }
}


export {
    ParticlesFlyer,
    ParticlesFlyerView
};