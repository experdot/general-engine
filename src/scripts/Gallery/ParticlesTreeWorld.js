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
    static get Title() {
        return "Particles - Tree";
    }

    initialize() {
        this.view = new GameWorldView(this);
    }

    createObjects() {
        this.addVisual(new ParticlesTree(new ParticlesCircleView()));
    }
}

export {
    ParticlesTreeWorld
};