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

    // [Obsolute Method]
    loopInvokeBySetInternal(action, internal = 16.67) {
        setInterval(action, internal);
    }

    stop(callback) {
        this.isLoop = false;
        this.stopCallback = callback;
    }
}

class AnimationBox {
    constructor(canvas, world, internal = 16) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.world = world;
        this.world.initializeUI(canvas);
        this.internal = internal;
        this.frameManager = new FrameManager();
    }

    run() {
        this.start(this.world);
        this.frameManager.loopInvoke(() => {
            this.update(this.world, this.context);
        });
    }

    stop() {
        this.frameManager.stop(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });
    }

    start(world) {
        world.start();
    }

    update(world, context) {
        world.view.draw(context);
        world.update();
    }
}

export {
    AnimationBox
};