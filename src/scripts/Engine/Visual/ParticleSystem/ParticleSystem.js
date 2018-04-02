import {
    GameVisual
} from "../../Core/GameObject/GameVisual";
import {
    GameView
} from "../../Core/GameObject/GameView";

class ParticlesBase extends GameVisual {
    constructor(view) {
        super(view);
        this.count = 100;
        this.particles = [];
    }

    killDead() {
        let length = this.particles.length;
        if (length > 0) {
            for (let index = length - 1; index >= 0; index--) {
                const element = this.particles[index];
                if (element.isDead) {
                    this.particles.splice(index, 1);
                }
            }
        }
    }
}

class ParticlesCircleView extends GameView {
    constructor(target, isFill = true, scale = 1) {
        super(target);
        this.isFill = isFill;
        this.scale = scale;
    }
    draw(context) {
        if (this.target.stopDraw) {
            return;
        }
        this.isFill ? this.drawByFillCircle(context) : this.drawByStrokeCircle(context);
    }

    drawByFillCircle(context) {
        for (let index = 0; index < this.target.particles.length; index++) {
            const element = this.target.particles[index];
            let p = element.location;
            context.beginPath();
            context.arc(p.x, p.y, element.size / 2 * this.scale, 0, Math.PI * 2, false);
            context.fillStyle = element.color.getRGBAValue();
            context.fill();
        }
    }

    drawByStrokeCircle(context) {
        for (let index = 0; index < this.target.particles.length; index++) {
            const element = this.target.particles[index];
            let p = element.location;
            context.beginPath();
            context.arc(p.x, p.y, element.size / 2 * this.scale, 0, Math.PI * 2, false);
            context.strokeStyle = element.color.getRGBAValue();
            context.closePath();
            context.stroke();
        }
    }
}

class ParticlesLineView extends GameView {
    draw(context) {
        if (this.target.stopDraw) {
            return;
        }
        for (let index = 1; index < this.target.particles.length; index++) {
            const element = this.target.particles[index];
            let p = element.location;
            let last = this.target.particles[index - 1].location || element.lastLocation;
            if (!last) {
                continue;
            }
            context.beginPath();
            context.moveTo(p.x, p.y);
            context.lineTo(last.x, last.y);
            context.lineWidth = element.size;
            context.strokeStyle = element.color.getRGBAValue();
            context.closePath();
            context.stroke();

            context.beginPath();
            context.arc(p.x, p.y, element.size / 2, 0, Math.PI * 2, false);
            context.fillStyle = element.color.getRGBAValue();
            context.fill();
        }
    }
}

export {
    ParticlesBase,
    ParticlesCircleView,
    ParticlesLineView
};