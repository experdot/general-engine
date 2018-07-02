import {
    GameWorld
} from "../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Game/GameWorld/GameWorldView";
import {
    ParticlesTree,
    ParticlesTreeView
} from "../Engine/Game/Visual/ParticleSystem/Tree/ParticlesTree";

class ParticlesTreeWorld extends GameWorld {
    static get Title() {
        return "Particles - Tree";
    }

    initialize() {
        this.view = new GameWorldView(this);
    }

    createObjects() {
        this.addVisual(new ParticlesTree(new ParticlesTreeView()));
    }
}

export {
    ParticlesTreeWorld
};