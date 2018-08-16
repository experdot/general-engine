import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    LSystemTree,
    LSystemTreeView
} from "./LSystem/LSystemTree";
import {
    GalleryTexts
} from "../Resources/GalleryTexts";

class LSystemTreeWorld extends GameWorld {
    static get Title() {
        return GalleryTexts.LSystemTreeWorld_Title;
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