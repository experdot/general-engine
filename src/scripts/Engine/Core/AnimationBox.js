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
            }
        };
        step();
    }

    // [Obsolute Method]
    loopInvokeBySetInternal(action, internal = 16.67) {
        setInterval(action, internal);
    }

    stop() {
        this.isLoop = false;
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
        this.frameManager.stop();
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