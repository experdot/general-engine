import { DelayTimer } from "../../Common/DelayTimer";

export class FrameManager {
    isLoop: boolean;
    frameCount: number;
    framePerSecond: number;
    lastSecondCount: number;
    timer: DelayTimer;
    onRateChanged: Function;
    stopCallback: Function;

    constructor() {
        this.isLoop = false;
        this.frameCount = 0;
        this.framePerSecond = 0;
        this.lastSecondCount = 0;
        this.timer = new DelayTimer();
        this.onRateChanged = null;
    }

    loopInvoke(action: Function) {
        this.isLoop = true;
        let handle: number;
        const step = () => {
            action && action();
            this.frameCount += 1;
            this.timer.delay(1000, (actual) => {
                let offset = actual === 1000 ? 0 : -1;
                this.framePerSecond = this.frameCount - this.lastSecondCount + offset;
                this.lastSecondCount = this.frameCount;
                this.onRateChanged && this.onRateChanged(this.framePerSecond);
            });
            if (this.isLoop) {
                handle = window.requestAnimationFrame(step);
            } else {
                window.cancelAnimationFrame(handle);
                this.frameCount = 0;
                this.framePerSecond = 0;
                this.lastSecondCount = 0;
                this.stopCallback && this.stopCallback();
            }
        };
        step();
    }

    stop(callback?: Function) {
        this.stopCallback = callback;
        this.isLoop = false;
    }
}