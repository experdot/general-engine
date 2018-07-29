import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    ParticlesTree,
    ParticlesTreeView
} from "./ParticleSystem/Tree/ParticlesTree";
import {
    GalleryResources
} from "../Resources/GalleryResource";

class ParticlesTreeWorld extends GameWorld {
    static get Title() {
        return GalleryResources.ParticlesTreeWorld_Title;
    }

    initialize() {

    }

    createObjects() {
        this.addChild(new ParticlesTree().joint(new ParticlesTreeView()));
    }
}

export {
    ParticlesTreeWorld
};