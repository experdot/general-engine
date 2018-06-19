class FrameManager {
    constructor() {
        this.isLoop = false;
    }

    loopInvoke(action) {
        this.isLoop = true;
        let step = () => {
            action();
            if (this.isLoop) {
                window.requestAnimationFrame(step);
            } else {
                this.stopCallback && this.stopCallback();
            }
        };
        step();
    }

    stop(callback) {
        this.stopCallback = callback;
        this.isLoop = false;
    }
}

export {
    FrameManager
};