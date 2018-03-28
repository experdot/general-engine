import {
    Vector2
} from "../../Fundamental/Vector";

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
        this.world.canvas = canvas;
        this.internal = internal;
        this.registEvents();
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

    registEvents() {
        this.canvas.addEventListener("click", (event) => {
            this.world.raiseSelfAndGameVisualsEvent("onClick", event);
        });
        this.canvas.addEventListener("mousemove", (event) => {
            this.world.raiseSelfAndGameVisualsEvent("onMouseMove", event);
            this.world.input.mouse = new Vector2(event.offsetX, event.offsetY);
        });
        window.onmousewheel = document.onmousewheel = (event) => {
            this.world.raiseSelfAndGameVisualsEvent("onMouseWheel", event);
        };
    }
}

export {
    AnimationBox
};