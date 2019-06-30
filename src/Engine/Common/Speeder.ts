export class Speeder {
    count: number = 0;
    radio: number;

    constructor(radio: number = 1) {
        this.radio = radio;
    }

    change(radio: number) {
        this.radio = radio;
        return this;
    }

    invoke(action?: Function) {
        this.count = (this.count + 1) % this.radio;
        if (this.count === 0) {
            this.count = 0;
            action && action();
        }
        return this;
    }
}