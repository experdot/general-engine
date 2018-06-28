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
    static Title() {
        return "Particles - Flyer";
    }

    initialize() {
        this.view = new GameWorldView(this);
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        let visual = new ParticlesFlyer(new ParticlesFlyerView());
        this.addVisual(visual);
    }
}

export {
    ParticlesFlyerWorld
};