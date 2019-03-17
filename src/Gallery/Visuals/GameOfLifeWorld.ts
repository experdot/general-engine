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
    GalleryTexts
} from "../Resources/GalleryTexts";

export class GameOfLifeWorld extends GameWorld {
    static get Title(): string {
        return GalleryTexts.GameOfLifeWorld_Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.addChild(new GameOfLife().joint(new GameOfLifeView()));
    }
}