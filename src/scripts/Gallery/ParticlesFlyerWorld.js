import {
    Color
} from "../Fundamental/Color";
import {
    GameWorld
} from "../Engine/Core/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Core/GameWorld/GameWorldView";
import {
    MouseInput,
    PointerInput
} from "../Engine/Core/Fundamental/Inputs";
import {
    ParticlesFlyerView,
    ParticlesFlyer
} from "../Engine/Visual/ParticleSystem/Flyer/ParticlesFlyer";

class ParticlesFlyerWorld extends GameWorld {
    initialize() {
        this.view = new GameWorldView(this);
        this.view.clearColor = new Color(0, 0, 0);
        this.inputs.addInput(new MouseInput());
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