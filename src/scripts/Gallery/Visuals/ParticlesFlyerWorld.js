import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    PointerInput
} from "../../Engine/Common/Inputs";
import {
    ParticlesFlyer,
    ParticlesFlyerView
} from "./ParticleSystem/Flyer/ParticlesFlyer";

class ParticlesFlyerWorld extends GameWorld {
    static get Title() {
        return "Particles - Flyer";
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        this.addChild(new ParticlesFlyer(), new ParticlesFlyerView());
    }
}

export {
    ParticlesFlyerWorld
};