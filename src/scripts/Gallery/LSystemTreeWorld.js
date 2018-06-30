import {
    GameWorld
} from "../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Game/GameWorld/GameWorldView";
import {
    LSystemTree,
    LSystemTreeView
} from "../Engine/Game/Visual/LSystem/LSystemTree";

class LSystemTreeWorld extends GameWorld {
    static get Title() {
        return "L-System - Tree";
    }

    initialize() {
        this.view = new GameWorldView(this);
    }

    createObjects() {
        this.addVisual(new LSystemTree(new LSystemTreeView()));
    }
}

export {
    LSystemTreeWorld
};