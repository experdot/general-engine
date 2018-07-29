import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    LSystemTree,
    LSystemTreeView
} from "./LSystem/LSystemTree";
import {
    GalleryResources
} from "../Resources/GalleryResource";

class LSystemTreeWorld extends GameWorld {
    static get Title() {
        return GalleryResources.LSystemTreeWorld_Title;
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