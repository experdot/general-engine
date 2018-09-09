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

export class LSystemTreeWorld extends GameWorld {
    static get Title(): string {
        return GalleryTexts.LSystemTreeWorld_Title;
    }

    initialize() {

    }

    createObjects() {
        this.addChild(new LSystemTree().joint(new LSystemTreeView()));
    }
}