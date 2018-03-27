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

class ParticlesView extends GameView {
    draw(context) {
        if (this.target.stopDraw) {
            return;
        }
        for (let index = 0; index < this.target.particles.length; index++) {
            const element = this.target.particles[index];
            let p = element.location;
            context.beginPath();
            context.arc(p.x, p.y, element.size / 2, 0, Math.PI * 2, false);
            context.fillStyle = element.color.getHexValue();
            context.fill();
        }
    }
}

export {
    ParticlesBase,
    ParticlesView
};