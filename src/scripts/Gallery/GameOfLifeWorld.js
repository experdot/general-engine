import {
    GameWorld
} from "../Engine/Core/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Core/GameWorld/GameWorldView";
import {
    GameOfLife,
    GameOfLifeView
} from "../Engine/Visual/CA/GameOfLife/GameOfLife";
import {
    PointerInput
} from "../Engine/Core/Fundamental/Inputs";

class GameOfLifeWorld extends GameWorld {
    static Title() {
        return "CA - GameOfLife";
    }
    initialize() {
        this.view = new GameWorldView(this);
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        let visual = new GameOfLife(new GameOfLifeView());
        this.addVisual(visual);
    }
}

export {
    GameOfLifeWorld
};