import { FrameManager } from "./FrameManager";

export class GameBox {

    container;
    canvas;
    context;
    world;
    frameManager;

    constructor(container, canvas, world) {
        this.container = container;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.world = world;
        this.world.initializeUI(container, canvas);
        this.frameManager = new FrameManager();
    }

    run() {
        this.world.$start.process();
        this.world.$gui.process(this.container);
        this.frameManager.loopInvoke(() => {
            this.world.$render.process(this.context);
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