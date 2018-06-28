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