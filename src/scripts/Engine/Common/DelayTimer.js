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
        let actual = current - this.lastTime;
        if (actual >= interval) {
            this.lastTime = current;
            action && action(actual);
        }
    }
}

export {
    DelayTimer
};