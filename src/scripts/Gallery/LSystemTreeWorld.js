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
    static Title() {
        return "L-System - Tree";
    }

    initialize() {
        this.view = new GameWorldView(this);
    }

    createObjects() {
        let visual = new LSystemTree(new LSystemTreeView());
        this.addVisual(visual);
    }
}

export {
    LSystemTreeWorld
};