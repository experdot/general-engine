import {
    GameWorld
} from "../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Game/GameWorld/GameWorldView";
import {
    ParticlesTree
} from "../Engine/Game/Visual/ParticleSystem/Tree/ParticlesTree";
import {
    ParticlesCircleView
} from "../Engine/Game/Visual/ParticleSystem/ParticleSystem";

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