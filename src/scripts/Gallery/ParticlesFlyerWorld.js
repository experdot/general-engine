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
    ParticlesFlyer,
    ParticlesFlyerView
} from "../Engine/Game/Visual/ParticleSystem/Flyer/ParticlesFlyer";

class ParticlesFlyerWorld extends GameWorld {
    static get Title() {
        return "Particles - Flyer";
    }

    initialize() {
        this.bind(new GameWorldView());
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        this.addVisual(new ParticlesFlyer(), new ParticlesFlyerView());
    }
}

export {
    ParticlesFlyerWorld
};