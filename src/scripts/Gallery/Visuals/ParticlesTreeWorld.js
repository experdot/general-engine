import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    ParticlesTree,
    ParticlesTreeView
} from "./ParticleSystem/Tree/ParticlesTree";

class ParticlesTreeWorld extends GameWorld {
    static get Title() {
        return "Particles - Tree";
    }

    initialize() {

    }

    createObjects() {
        this.addChild(new ParticlesTree(), new ParticlesTreeView());
    }
}

export {
    ParticlesTreeWorld
};