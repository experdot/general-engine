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
    static get Title() {
        return "Particels - Walker";
    }

    initialize() {
        this.bind(new GameWorldView());
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        this.addVisual(new ParticlesWalker(), new ParticlesWalkerView());
    }
}

export {
    ParticlesWalkerWorld
};