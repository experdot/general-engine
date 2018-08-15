import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    PointerInput
} from "../../Engine/Common/Inputs";
import {
    GameOfLife,
    GameOfLifeView
} from "./CA/GameOfLife/GameOfLife";
import {
    GalleryResources
} from "../Resources/GalleryResource";

export class GameOfLifeWorld extends GameWorld {
    static get Title() {
        return GalleryResources.GameOfLifeWorld_Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        this.addChild(new GameOfLife().joint(new GameOfLifeView()));
    }
}