import {
    Color
} from "../Fundamental/Color";
import {
    GameWorld
} from "../Engine/Core/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Core/GameWorld/GameWorldView";
import {
    LSystemTree,
    LSystemTreeView
} from "../Engine/Visual/LSystem/LSystemTree";

class LSystemTreeWorld extends GameWorld {
    initialize() {
        this.view = new GameWorldView(this);
        this.view.clearColor = new Color(0, 0, 0);
    }

    createObjects() {
        let visual = new LSystemTree(new LSystemTreeView());
        this.addVisual(visual);
    }
}

export {
    LSystemTreeWorld
};