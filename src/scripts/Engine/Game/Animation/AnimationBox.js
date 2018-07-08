import {
    FrameManager
} from "./FrameManager";

class AnimationBox {
    constructor(canvas, world) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.world = world;
        this.world.initializeUI(canvas);
        this.frameManager = new FrameManager();
    }

    run() {
        this.world.$start.process();
        this.frameManager.loopInvoke(() => {
            this.world.view.$render.process(this.context);
            this.world.$update.process();
        });
    }

    stop() {
        this.frameManager.stop(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });
        this.world.$dispose.process();
    }
}

export {
    AnimationBox
};