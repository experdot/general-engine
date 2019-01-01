import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    PointerInput,
    KeyInput
} from "../../Engine/Common/Inputs";
import {
    EndlessAbyss,
    EndlessAbyssView
} from "./EndlessAbyss/EndlessAbyss";
import {
    VisualPointer
} from "../Visuals/VisualPointer/VisualPointer";
import {
    GalleryTexts
} from "../Resources/GalleryTexts";

class EndlessAbyssWorld extends GameWorld {
    static get Title() {
        return GalleryTexts.EndlessAbyssWorld.Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new KeyInput());
        this.addChild(new EndlessAbyss().joint(new EndlessAbyssView()));
        this.joint(new VisualPointer());
    }
}

export {
    EndlessAbyssWorld
};