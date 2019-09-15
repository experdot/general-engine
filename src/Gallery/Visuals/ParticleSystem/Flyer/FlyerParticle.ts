import {
    DynamicParticle
} from "../Particle/DynamicParticle";
import {
    Vector2
} from "../../../../Engine/Numerics/Vector2";
import { RandomEmoji } from "../../../../Engine/UI/Font";
import { Speeder } from "../../../../Engine/Common/Speeder";

export class FlyerParticle extends DynamicParticle {
    get trail(): Vector2 {
        return this.location.add(new Vector2(0, this.size / 2).rotate(Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2));
    }

    neighbourDistance: number;

    history: Vector2[] = [];

    count: number = 0;

    emoji: string;

    speeder: Speeder;

    constructor(location?: Vector2, size = 1, age = 0) {
        super(location, size, age);
        this.velocityUpon = 50;
        this.neighbourDistance = 400;
        this.emoji = RandomEmoji.one;
        this.speeder = new Speeder(1);
    }

    update(flyers: FlyerParticle[], mouse) {
        this.alignspeed(flyers, 3);
        this.seperate(flyers, 2);
        this.cohesion(flyers, 3);

        mouse && this.follow(mouse, 3);

        // const radio = Math.round(this.velocity.length * 2 + 1)
        // this.speeder.change(radio).invoke(() => {
        //     this.history.push(this.trail);
        // });

        // if (this.history.length > 30) {
        //     this.history.shift();
        // }

        this.move();
    }

    private alignspeed(flyers, ratio = 1) {
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
            steer.limitLength(5);
            this.applyForce(steer.multiply(ratio));
        }
    }

    private seperate(flyers, ratio = 1) {
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
            steer.limitLength(5);
            this.applyForce(steer.multiply(ratio));
        }
    }

    private cohesion(flyers, ratio = 1) {
        let sum = new Vector2();
        let sumCount = 0;
        this.forEachDistance(flyers, (element, offset, distance) => {
            sum = sum.add(element.location);
            sumCount++;
        });
        if (sumCount > 0) {
            sum = sum.divide(sumCount);
            let steer = this.seekDefault(sum);
            steer.limitLength(0.01);
            this.applyForce(steer.multiply(ratio));
        }
    }

    private follow(target, ratio = 1) {
        this.applyForce(this.seekDefault(target).multiply(ratio));
    }

    private seekDefault(target) {
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