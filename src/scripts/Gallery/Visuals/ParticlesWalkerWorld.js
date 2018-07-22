import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    PointerInput
} from "../../Engine/Common/Inputs";
import {
    ParticlesWalker,
    ParticlesWalkerView
} from "./ParticleSystem/Walker/ParticlesWalker";

class ParticlesWalkerWorld extends GameWorld {
    static get Title() {
        return "Particels - Walker";
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        this.addChild(new ParticlesWalker().joint(new ParticlesWalkerView()));
    }
}

export {
    ParticlesWalkerWorld
};