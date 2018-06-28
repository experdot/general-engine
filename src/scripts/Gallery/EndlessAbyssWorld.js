import {
    GameWorld
} from "../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Game/GameWorld/GameWorldView";
import {
    PointerInput,
    KeyInput
} from "../Engine/Common/Inputs";
import {
    EndlessAbyss,
    EndlessAbyssView
} from "./EndlessAbyss/EndlessAbyss";


class EndlessAbyssWorld extends GameWorld {
    static Title() {
        return "Game - EndlessAbyss";
    }
    initialize() {
        this.view = new GameWorldView(this);
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new KeyInput());
    }

    createObjects() {
        let visual = new EndlessAbyss(new EndlessAbyssView());
        this.addVisual(visual);
    }
}

export {
    EndlessAbyssWorld
};