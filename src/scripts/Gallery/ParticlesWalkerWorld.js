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
    ParticlesCircleView
} from "../Engine/Visual/ParticleSystem/ParticleSystem";
import {
    ParticlesWalker
} from "../Engine/Visual/ParticleSystem/Walker/ParticlesWalker";

class ParticlesWalkerWorld extends GameWorld {
    initialize() {
        this.view = new GameWorldView(this);
        this.view.clearColor = new Color(0, 0, 0);
    }

    createObjects() {
        let visual = new ParticlesWalker(new ParticlesCircleView());
        this.addVisual(visual);
    }
}

export {
    ParticlesWalkerWorld
};