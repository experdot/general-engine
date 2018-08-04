export class DelayTimer {
    private lastTime: number;

    constructor() {
        this.reset();
    }

    reset() {
        this.lastTime = new Date().getTime();
        return this;
    }

    delay(interval: number, action?: (interval: number) => void, failed?: (interval: number) => void) {
        let current = new Date().getTime();
        let actual = current - this.lastTime;
        if (actual >= interval) {
            this.lastTime = current;
            action && action(actual);
        } else {
            failed && failed(actual);
        }
    }
}