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
import { PointerInput } from "../../Engine/Inputs/PointerInput";

export class LSystemTreeWorld extends GameWorld {
    static get Title(): string {
        return GalleryTexts.LSystemTreeWorld_Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.addChild(new LSystemTree().joint(LSystemTree.defaultView));
    }
}