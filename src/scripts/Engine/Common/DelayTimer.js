class DelayTimer {
    constructor() {
        this.reset();
    }

    reset() {
        this.lastTime = new Date().getTime();
        return this;
    }

    delay(interval, action) {
        let current = new Date().getTime();
        if (current - this.lastTime > interval) {
            this.lastTime = current;
            action && action();
        }
    }
}
export {
    DelayTimer
};