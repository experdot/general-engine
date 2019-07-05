export class Speeder {
    count: number = 0;
    speed: number;

    constructor(speed: number = 1) {
        this.speed = speed;
    }

    change(speed: number) {
        this.speed = speed;
        return this;
    }

    invoke(action?: Function) {
        this.count = (this.count + 1) % this.speed;
        if (this.count === 0) {
            action && action();
        }
        return this;
    }
}