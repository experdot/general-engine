import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    FrameManager
} from "./FrameManager";

class AnimationBox extends GeneralObject {
    constructor(canvas, world) {
        super();
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.world = world;
        this.world.initializeUI(canvas);
        this.frameManager = new FrameManager();
        this.start.next(() => {
            this.world.start.process();
        });
        this.update.next(() => {
            this.world.view.render.process(this.context);
            this.world.update.process();
        });
    }

    run() {
        this.start.process();
        this.frameManager.loopInvoke(() => {
            this.update.process();
        });
    }

    stop() {
        this.frameManager.stop(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });
        this.world.dispose.process();
    }
}

export {
    AnimationBox
};