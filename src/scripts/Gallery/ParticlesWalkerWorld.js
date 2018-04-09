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
    ParticlesWalker,
    ParticlesWalkerView
} from "../Engine/Visual/ParticleSystem/Walker/ParticlesWalker";
import {
    MouseInput,
    PointerInput
} from "../Engine/Core/Fundamental/Inputs";

class ParticlesWalkerWorld extends GameWorld {
    initialize() {
        this.view = new GameWorldView(this);
        this.view.clearColor = new Color(0, 0, 0);
        this.inputs.addInput(new MouseInput());
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