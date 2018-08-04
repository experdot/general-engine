import { FrameManager } from "./FrameManager";
import { GameWorld } from "../GameWorld/GameWorld";

export class GameBox {

    container: HTMLElement;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    world: GameWorld;
    frameManager: FrameManager;

    constructor(container: HTMLElement, canvas: HTMLCanvasElement, world: GameWorld) {
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