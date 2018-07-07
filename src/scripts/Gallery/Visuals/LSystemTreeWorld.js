import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../../Engine/Game/GameWorld/GameWorldView";
import {
    LSystemTree,
    LSystemTreeView
} from "./LSystem/LSystemTree";

class LSystemTreeWorld extends GameWorld {
    static get Title() {
        return "L-System - Tree";
    }

    initialize() {
        this.bind(new GameWorldView());
    }

    createObjects() {
        this.addVisual(new LSystemTree(), new LSystemTreeView());
    }
}

export {
    LSystemTreeWorld
};