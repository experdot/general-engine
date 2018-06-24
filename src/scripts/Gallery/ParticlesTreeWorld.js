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
    ParticlesTree
} from "../Engine/Visual/ParticleSystem/Tree/ParticlesTree";

class ParticlesTreeWorld extends GameWorld {
    static Title() {
        return "Particles - Tree";
    }

    initialize() {
        this.view = new GameWorldView(this);
    }

    createObjects() {
        let visual = new ParticlesTree(new ParticlesCircleView());
        this.addVisual(visual);
    }
}

export {
    ParticlesTreeWorld
};