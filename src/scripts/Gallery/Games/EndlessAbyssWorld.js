import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../../Engine/Game/GameWorld/GameWorldView";
import {
    PointerInput,
    KeyInput
} from "../../Engine/Common/Inputs";
import {
    EndlessAbyss,
    EndlessAbyssView
} from "./EndlessAbyss/EndlessAbyss";

class EndlessAbyssWorld extends GameWorld {
    static get Title() {
        return "Game - EndlessAbyss";
    }

    initialize() {
        this.bind(new GameWorldView());
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new KeyInput());
    }

    createObjects() {
        this.addVisual(new EndlessAbyss(), new EndlessAbyssView());
    }
}

export {
    EndlessAbyssWorld
};