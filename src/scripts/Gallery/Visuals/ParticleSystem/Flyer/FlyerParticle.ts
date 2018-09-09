import {
    DynamicParticle
} from "../Particle/DynamicParticle";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";

class FlyerParticle extends DynamicParticle {
    neighbourDistance: number;

    constructor(location?: Vector2, size = 1, age = 0) {
        super(location, size, age);
        this.velocityUpon = 5;
        this.neighbourDistance = 400;
    }

    update(flyers, blocks, mouse) {
        this.alignspeed(flyers);
        this.seperate(flyers);
        this.cohesion(flyers);
        //this.seperate(blocks, 5);

        mouse && this.follow(mouse, 3);
        //this.checkRadius(mouse, new Vector2(rect.width, rect.height).length / 3);

        this.move();
        //this.checkBorder(rect);
    }

    alignspeed(flyers) {
        let sum = new Vector2();
        let sumCount = 0;
        this._forEachDistance(flyers, (element, offset, distance) => {
            if (distance < this.neighbourDistance) {
                sum = sum.add(element.velocity);
                sumCount++;
            }
        });
        if (sumCount > 0) {
            sum = sum.divide(sumCount);
            sum.limitLength(this.velocityUpon);
            let steer = sum.subtract(this.velocity);
            steer.limitLength(1);
            this.applyForce(steer);
        }
    }

    seperate(flyers, ratio = 1) {
        let sum = new Vector2();
        let sumCount = 0;
        this._forEachDistance(flyers, (element, offset, distance) => {
            let minDistance = (this.size + element.size) / 2 + 5;
            if (distance > 0 && distance < minDistance) {
                offset.normalize();
                offset.divide(distance);
                sum = sum.add(offset);
                sumCount++;
            }
        });
        if (sumCount > 0) {
            sum = sum.divide(sumCount);
            sum.normalize();
            sum.multiply(this.velocityUpon);
            let steer = sum.subtract(this.velocity);
            steer.limitLength(10);
            this.applyForce(steer.multiply(ratio));
        }
    }

    cohesion(flyers) {
        let sum = new Vector2();
        let sumCount = 0;
        this._forEachDistance(flyers, (element, offset, distance) => {
            if (distance < this.neighbourDistance) {
                sum = sum.add(element.location);
                sumCount++;
            }
        });
        if (sumCount > 0) {
            sum = sum.divide(sumCount);
            let steer = this.seek(sum);
            steer.limitLength(0.1);
            this.applyForce(steer);
        }
    }

    follow(target, ratio = 1) {
        this.applyForce(this.seek(target).multiply(ratio));
    }

    checkRadius(mouse, maxRadius = 100) {
        let offset = this.location.subtract(mouse);
        let distance = offset.length;
        let alpha = Math.max(0.1, Math.min(1, 1 - (distance / maxRadius)));

        let current = this.color.r;
        let target = 175 + alpha * 80;
        let sign = Math.sign(target - this.color.r);
        let real = current + sign * 0.5 * 10;

        this.color.r = this.color.g = this.color.b = real;
    }

    checkBorder(rect) {
        let p = this.location;
        let w = rect.width;
        let h = rect.height;

        let xf = this.size / 2 + 10;
        let yf = this.size / 2 + 10;

        if (p.x < xf) {
            p.x = xf;
            this.velocity.x *= -1;
        } else if (p.x > w - xf) {
            p.x = w - xf;
            this.velocity.x *= -1;
        }
        if (p.y < yf) {
            p.y = yf;
            this.velocity.y *= -1;
        } else if (p.y > h - yf) {
            p.y = h - yf;
            this.velocity.y *= -1;
        }
    }

    seek(target) {
        return this._seek(this.location, target, this.velocity);
    }


    _seek(source, target, velocity) {
        let desired = target.subtract(source);
        desired.normalize();
        desired.multiply(this.velocityUpon);
        let steer = desired.subtract(velocity);
        steer.limitLength(1);
        return steer;
    }

    _forEachDistance(flyers, action) {
        flyers.forEach(element => {
            let offset = this.location.subtract(element.location);
            let distance = offset.length;
            action && action(element, offset, distance);
        });
    }

}

export {
    FlyerParticle
};