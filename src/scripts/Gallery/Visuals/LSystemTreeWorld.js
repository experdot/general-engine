import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    LSystemTree,
    LSystemTreeView
} from "./LSystem/LSystemTree";

class LSystemTreeWorld extends GameWorld {
    static get Title() {
        return "L-System - Tree";
    }

    initialize() {

    }

    createObjects() {
        this.addChild(new LSystemTree().joint(new LSystemTreeView()));
    }
}

export {
    LSystemTreeWorld
};