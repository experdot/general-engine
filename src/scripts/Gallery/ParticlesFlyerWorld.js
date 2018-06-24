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
    ParticlesFlyerView,
    ParticlesFlyer
} from "../Engine/Visual/ParticleSystem/Flyer/ParticlesFlyer";

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