import {
    Inputs
} from "../../Common/Inputs";
import {
    GameVisual
} from "../GameObject/GameVisual";
import {
    GameView
} from "../GameObject/GameView";
import {
    GeneralProcess
} from "../../Core/GeneralProcess";


class GameWorld extends GameVisual {
    constructor(width, height) {
        super();
        // set size
        this.width = width;
        this.height = height;
        // game visual objects
        this.visuals = [];
        // game input
        this.inputs = new Inputs().change((eventName, event) => this.raiseEvent(eventName, event));
        // initialize
        this.initialize();
        this.createObjects();

        //visuals
        GeneralProcess.find(this).forEach(element => {
            element.value.next(() => {
                this.visuals.forEach(v => {
                    v[element.key].process();
                });
            });
        });

        //dispose
        this.dispose.next(() => this.inputs.release());
    }

    initialize() {}

    createObjects() {}

    initializeUI(ui) {
        this.ui = ui;
        this.inputs.launch(this.ui);
    }

    addVisual(visual, view = new GameView()) {
        visual.world = this;
        visual.bind(view);
        this.visuals.push(visual);
    }

    raiseEvent(eventName, event) {
        this.eventSystem.raiseEvent(eventName, event);
        this.visuals.forEach(element => {
            element.eventSystem.raiseEvent(eventName, event);
        });
    }
}

export {
    GameWorld
};