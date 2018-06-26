import {
    GameWorld
} from "../Engine/Core/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Core/GameWorld/GameWorldView";
import {
    PointerInput
} from "../Engine/Core/Fundamental/Inputs";
import {
    EndlessAbyss,
    EndlessAbyssView
} from "../Engine/Game/EndlessAbyss/EndlessAbyss";

class EndlessAbyssWorld extends GameWorld {
    static Title() {
        return "Game - EndlessAbyss";
    }
    initialize() {
        this.view = new GameWorldView(this);
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        let visual = new EndlessAbyss(new EndlessAbyssView());
        this.addVisual(visual);
    }
}

export {
    EndlessAbyssWorld
};