import { GameVisual } from "../GameObject/GameVisual";
import { Inputs } from "../../Inputs/Inputs";
import { Vector2 } from "../../Numerics/Vector2";

export interface UIDescription {
    container: HTMLElement;
    canvas: HTMLCanvasElement;
}

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

    get center() {
        return new Vector2(this.width / 2, this.height / 2);
    }

    width: number;
    height: number;

    inputs: Inputs;
    ui: UIDescription;

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
    }

    addChild(visual: GameVisual) {
        super.addChild(visual);
        visual.world = this;
        return this;
    }

    dispose() {
        super.dispose();
        this.inputs.dispose();
    }

    initialize() {

    }

    initializeUI(container: HTMLElement, canvas: HTMLCanvasElement) {
        this.ui.container = container;
        this.ui.canvas = canvas;
        this.inputs.launch(this.ui.container);
    }
}