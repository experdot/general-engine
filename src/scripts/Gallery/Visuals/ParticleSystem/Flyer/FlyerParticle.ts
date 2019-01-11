import {
    DynamicParticle
} from "../Particle/DynamicParticle";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import { RandomEmoji } from "../../../../Engine/UI/Font";

export class FlyerParticle extends DynamicParticle {
    neighbourDistance: number;

    history: Vector2[] = [];

    count: number = 0;

    emoji: string;

    constructor(location?: Vector2, size = 1, age = 0) {
        super(location, size, age);
        this.velocityUpon = 5;
        this.neighbourDistance = 400;
        this.emoji = RandomEmoji.one;
    }

    update(flyers: FlyerParticle[], blocks: FlyerParticle[], mouse) {
        this.alignspeed(flyers, 3);
        this.seperate(flyers, 1);
        this.cohesion(flyers, 2);
        this.seperate(blocks, 5);

        mouse && this.follow(mouse, 3);
        //this.checkRadius(mouse, new Vector2(rect.width, rect.height).length / 3);

        this.move();

        this.count = (this.count + 1) % Math.round(this.velocity.length * 2 + 1);
        if (this.count === 0) {
            this.history.push(this.location);
        }
        if (this.history.length > 30) {
            this.history.shift();
        }
    }

    alignspeed(flyers, ratio = 1) {
        let sum = new Vector2();
        let sumCount = 0;
        this.forEachDistance(flyers, (element, offset, distance) => {
            if (distance < this.neighbourDistance) {
                sum = sum.add(element.velocity);
                sumCount++;
            }
        });
        if (sumCount > 0) {
            sum = sum.divide(sumCount);
            sum.limitLength(this.velocityUpon);
            let steer = sum.subtract(this.velocity);
            steer.limitLength(10);
            this.applyForce(steer.multiply(ratio));
        }
    }

    seperate(flyers, ratio = 1) {
        let sum = new Vector2();
        let sumCount = 0;
        this.forEachDistance(flyers, (element, offset, distance) => {
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
            steer.limitLength(8);
            this.applyForce(steer.multiply(ratio));
        }
    }

    cohesion(flyers, ratio = 1) {
        let sum = new Vector2();
        let sumCount = 0;
        this.forEachDistance(flyers, (element, offset, distance) => {
            sum = sum.add(element.location);
            sumCount++;
        });
        if (sumCount > 0) {
            sum = sum.divide(sumCount);
            let steer = this.seekDefault(sum);
            steer.limitLength(0.1);
            this.applyForce(steer.multiply(ratio));
        }
    }

    follow(target, ratio = 1) {
        this.applyForce(this.seekDefault(target).multiply(ratio));
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

    seekDefault(target) {
        return this.seek(this.location, target, this.velocity);
    }

    private seek(source, target, velocity) {
        let desired = target.subtract(source);
        desired.normalize();
        desired.multiply(this.velocityUpon);
        let steer = desired.subtract(velocity);
        steer.limitLength(1);
        return steer;
    }

    private forEachDistance(flyers, action) {
        flyers.forEach(element => {
            let offset = this.location.subtract(element.location);
            let distance = offset.length;
            action && action(element, offset, distance);
        });
    }
}