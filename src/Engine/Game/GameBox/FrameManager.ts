import { DelayTimer } from "../../Common/DelayTimer";

export class FrameManager {
    isLoop: boolean;
    frameCount: number;
    framePerSecond: number;
    lastSecondCount: number;
    onRateChanged: Function;

    private timer: DelayTimer= new DelayTimer();;
    private stopCallback: Function;

    constructor() {
        this.initialize();
        this.isLoop = false;
    }

    loopInvoke(action: Function) {
        this.initialize();
        this.isLoop = true;
        let handle: number;
        const step = () => {
            action && action();
            this.frameCount += 1;
            this.timer.delay(1000, (actual) => {
                const offset = actual === 1000 ? 0 : -1;
                this.framePerSecond = this.frameCount - this.lastSecondCount + offset;
                this.lastSecondCount = this.frameCount;
                this.onRateChanged && this.onRateChanged(this.framePerSecond);
            });
            if (this.isLoop) {
                handle = window.requestAnimationFrame(step);
            } else {
                window.cancelAnimationFrame(handle);
                this.initialize();
                this.stopCallback && this.stopCallback();
            }
        };
        step();
    }

    stop(callback?: Function) {
        this.stopCallback = callback;
        this.isLoop = false;
    }

    private initialize() {
        this.frameCount = 0;
        this.framePerSecond = 0;
        this.lastSecondCount = 0;
    }
}