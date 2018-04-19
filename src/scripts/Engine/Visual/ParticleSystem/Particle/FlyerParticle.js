import {
    DynamicParticle
} from "./DynamicParticle";
import {
    Vector2
} from "../../../../Fundamental/Vector";

class FlyerParticle extends DynamicParticle {
    constructor(location, size = 1, age = 0) {
        super(location, size, age);
        this.velocityUpon = 3;
        this.neighbourDistance = 200;
    }

    update(flyers, rect, mouse) {
        this.alignspeed(flyers);
        this.seperate(flyers);
        this.cohesion(flyers);
        this.follow(mouse, 0.5);
        this.checkRadius(mouse, new Vector2(rect.width, rect.height).length() / 4);

        this.move();
        this.checkBorder(rect);
        this.findNeighbour(flyers);
    }

    alignspeed(flyers) {
        let sum = new Vector2();
        let sumCount = 0;
        flyers.forEach(element => {
            let offset = this.location.subtract(element.location);
            let distance = offset.length();
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

    seperate(flyers) {
        let sum = new Vector2();
        let sumCount = 0;
        flyers.forEach(element => {
            let offset = this.location.subtract(element.location);
            let distance = offset.length();
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
            this.applyForce(steer);
        }
    }

    cohesion(flyers) {
        let sum = new Vector2();
        let sumCount = 0;
        flyers.forEach(element => {
            let offset = this.location.subtract(element.location);
            let distance = offset.length();
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

    findNeighbour(flyers) {
        let minDistance = Number.POSITIVE_INFINITY;
        let minIndex = -1;
        flyers.forEach((element, index) => {
            let offset = this.location.subtract(element.location);
            let distance = offset.length();
            if (distance > 0 && distance < 100) {
                if (distance < minDistance) {
                    minDistance = distance;
                    minIndex = index;
                }
            }
        });

        if (minIndex > 0) {
            this.neighbour = flyers[minIndex];
        } else {
            this.neighbour = null;
        }

    }

    checkRadius(mouse, maxRadius = 100) {
        let offset = this.location.subtract(mouse);
        let distance = offset.length();
        if (distance > maxRadius) {
            this.velocity = new Vector2();
        }
        let alpha = Math.max(0.1, Math.min(1, 1 - (distance / maxRadius)));
        this.color.r = this.color.g = this.color.b = alpha * 75 + 180;

        //this.color.a = Math.max(0.1, Math.min(1, 1 - (distance / maxRadius)));
        //this.color.a = Math.max(0.1, Math.min(1, this.velocity.length() / this.velocityUpon));

        //this.size = Math.max(0.1, Math.min(1, 1 - (distance / maxRadius))) * 64 + 16;
        //this.size = Math.max(1, Math.min(16, this.velocity.length() / this.velocityUpon * 128));
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

}

export {
    FlyerParticle
};