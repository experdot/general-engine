import {
    Color
} from "../../../Fundamental/Color";
import {
    Vector2
} from "../../../Fundamental/Vector";
import {
    Random
} from "../../../Fundamental/Random";
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

class Particle {
    constructor(location, size = 1, age = 0) {
        this.location = location;
        this.size = size;
        this.age = age;
        this.color = new Color(0, 0, 0, 1);
        this.isDead = false;
    }
}

class DynamicParticle extends Particle {
    constructor(location, size = 1, age = 0) {
        super(location, size, age);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.mass = 10.0;
        this.velocityUpon = 5.0;
    }

    applyForce(force) {
        this.acceleration = this.acceleration.add(force.divide(this.mass));
    }

    move() {
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity.limitLength(this.velocityUpon);
        this.location = this.location.add(this.velocity);
        this.acceleration = new Vector2(0, 0);
    }

    moveTo(location) {
        this.location = location;
        this.velocity.setLength(0);
    }

}

class SpotParticle extends DynamicParticle {
    constructor(location, size = 1, age = 0) {
        super(location, size, age);

        this.angleOffset = Math.random() * 0.03 - 0.015;
        this.velocityUpon = 16.0;
        this.random = new Random();

        this.sizeMinimum = 1.0;
        this.sizeRadius = 0.995;

        this.rotateRadius = 0.01;
        this.rotateRadiusRandom = 0.001;

        this.divideRadius = 0.03;
        this.divideSizeRadius = 0.80;
        this.divideSizeRadiusEx = 0.92;
        this.divideColorIncrement = 0.9;

    }

    update(particles, count) {
        if (this.age > 0) {
            this.age -= 1;
            this.size = this.size * this.sizeRadius;
            this.velocity = this.velocity.rotate(this.angleOffset * this.rotateRadius);
            this.velocity = this.velocity.rotate(this.random.nextNorm(-100, 100) * this.rotateRadiusRandom);
            this.color = this.getGradientColor(this.divideColorIncrement);
            this.velocityUpon = this.size * 0.38;
            this.move();
        }
        if (this.size > this.sizeMinimum) {
            if (Math.random() < this.divideRadius) {
                this.divide(particles, count);
            }
        } else {
            this.velocity = new Vector2(0, 0);
            this.isDead = true;
        }
    }

    divide(particles, count) {
        if (count < 2) {
            count = 2;
        }
        var newSize = this.size * this.divideSizeRadius;
        this.size = newSize;
        this.age = this.random.nextNorm(0, 30);
        this.angleOffset = Math.random() * 0.02 - 0.01;
        if (count > 1) {
            for (let i = 2; i <= count; i++) {
                newSize *= this.divideSizeRadiusEx;
                let particle = new SpotParticle(this.location, newSize);
                particle.velocity = this.velocity.rotate(this.random.next(-100, 100) * 0.011).multiply(0.618);
                particle.age = this.random.nextNorm(0, 40);
                particle.color = this.getDivideColor(this.divideColorIncrement);
                particles.push(particle);
            }
        }
    }

    getGradientColor(increment = 1) {
        const upon = 255;

        var r = this.color.r;
        r += increment;
        r = Math.min(upon, Math.max(0, r));

        var g = this.color.g;
        g += increment;
        g = Math.min(upon, Math.max(0, g));

        var b = this.color.b;
        b += increment;
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b);
    }

    getDivideColor(increment = 1) {
        const upon = 255;

        var r = this.color.r;
        var len = this.velocity.length() * 5;
        var half = len / 2;

        r += increment * (Math.random() * len - half);
        r = Math.min(upon, Math.max(0, r));

        var g = this.color.g;
        g += increment * (Math.random() * len - half);
        g = Math.min(upon, Math.max(0, g));

        var b = this.color.b;
        b += increment * (Math.random() * len - half);
        b = Math.min(upon, Math.max(0, b));

        return new Color(r, g, b);
    }
}

class ParticlesTree extends ParticlesBase {
    constructor(view) {
        super(view);
        this.spots = [];
        this.random = new Random();
    }

    start() {
        var minLength = Math.min(this.world.width, this.world.height);
        var ratio = minLength / 2500 * Math.log10(minLength);
        var center = new Vector2(this.world.width / 2, this.world.height * 1.2);
        var root = new SpotParticle(center);
        root.velocity = new Vector2(0, -16 * ratio);
        root.size = 256 * ratio;
        root.age = 30;
        root.color = new Color(10, 10, 10);
        this.spots.push(root);
        this.particles = this.spots;
    }

    update() {
        if (this.stopDraw) {
            return;
        }

        if (this.spots.length > 60000) {
            this.stopDraw = true;
            return;
        }
        if (this.spots.length > 0) {
            for (let index = 0; index < this.spots.length; index++) {
                const element = this.particles[index];
                element.update(this.spots, parseInt(this.random.nextNorm(1, 3)));
            }
            this.killDead(this.spots);
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
    ParticlesTree,
    ParticlesView
};