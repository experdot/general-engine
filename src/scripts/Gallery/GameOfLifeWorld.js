import {
    GameWorld
} from "../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Game/GameWorld/GameWorldView";
import {
    PointerInput
} from "../Engine/Common/Inputs";
import {
    GameOfLife,
    GameOfLifeView
} from "../Engine/Game/Visual/CA/GameOfLife/GameOfLife";

class GameOfLifeWorld extends GameWorld {
    static get Title() {
        return "CA - GameOfLife";
    }

    initialize() {
        this.bind(new GameWorldView());
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        this.addVisual(new GameOfLife(), new GameOfLifeView());
    }
}

export {
    GameOfLifeWorld
};