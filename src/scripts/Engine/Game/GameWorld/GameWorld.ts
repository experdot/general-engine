import { GameVisual } from "../GameObject/GameVisual";
import { Inputs } from "../../Common/Inputs";

export class GameWorld extends GameVisual {
    get size() {
        return {
            width: this.width,
            height: this.height,
            center: {
                x: this.width / 2,
                y: this.height / 2,
            }
        };
    }

    width: number;
    height: number;
    world: GameWorld;
    inputs: Inputs;
    ui: any;

    constructor(width: number, height: number) {
        super();

        this.width = width;
        this.height = height;

        this.world = this;

        this.inputs = new Inputs().change((eventName, event) => this.dispatch(eventName, event));

        this.ui = {
            container: null,
            canvas: null
        };

        this.initialize();
        this.createObjects();
    }

    initialize() { }

    createObjects() { }

    initializeUI(container: HTMLElement, canvas: HTMLCanvasElement) {
        this.ui.container = container;
        this.ui.canvas = canvas;
        this.inputs.launch(this.ui.container);
    }

    addChild(visual: GameVisual) {
        super.addChild(visual);
        visual.world = this;
        return this;
    }

    dispose() {
        super.dispose();
        this.inputs.release();
    }
}