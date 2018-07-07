class DelayTimer {
    constructor() {
        this.reset();
    }

    reset() {
        this.lastTime = new Date().getTime();
        return this;
    }

    delay(interval, action, fail) {
        let current = new Date().getTime();
        let actual = current - this.lastTime;
        if (actual >= interval) {
            this.lastTime = current;
            action && action(actual);
        } else {
            fail && fail(actual);
        }
    }
}

export {
    DelayTimer
};