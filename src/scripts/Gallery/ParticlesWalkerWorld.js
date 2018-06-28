import {
    GameWorld
} from "../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Game/GameWorld/GameWorldView";
import {
    PointerInput
} from "../Engine/Common/Inputs";
import {
    ParticlesWalker,
    ParticlesWalkerView
} from "../Engine/Game/Visual/ParticleSystem/Walker/ParticlesWalker";

class ParticlesWalkerWorld extends GameWorld {
    static Title() {
        return "Particels - Walker";
    }

    initialize() {
        this.view = new GameWorldView(this);
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        let visual = new ParticlesWalker(new ParticlesWalkerView());
        this.addVisual(visual);
    }
}

export {
    ParticlesWalkerWorld
};