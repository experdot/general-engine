import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    PointerInput
} from "../../Engine/Common/Inputs";
import {
    GameOfLife,
    GameOfLifeView
} from "./CA/GameOfLife/GameOfLife";

class GameOfLifeWorld extends GameWorld {
    static get Title() {
        return "CA - GameOfLife";
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        this.addChild(new GameOfLife().joint(new GameOfLifeView()));
    }
}

export {
    GameOfLifeWorld
};