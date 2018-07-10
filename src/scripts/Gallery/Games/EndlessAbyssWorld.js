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

class EndlessAbyssWorld extends GameWorld {
    static get Title() {
        return "Game - EndlessAbyss";
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new KeyInput());
    }

    createObjects() {
        this.addChild(new EndlessAbyss(), new EndlessAbyssView());
        this.proxy(new VisualPointer());
    }
}

export {
    EndlessAbyssWorld
};