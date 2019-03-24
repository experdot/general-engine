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

    start() {
        this.world.processes.start.process();
        this.world.processes.gui.process(this.world, this.container);
        this.frameManager.loopInvoke(() => {
            this.world.processes.render.process(this.world, this.context);
            this.world.processes.update.process();
        });
    }

    stop() {
        this.frameManager.stop(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });
        this.world.processes.dispose.process();
    }
}