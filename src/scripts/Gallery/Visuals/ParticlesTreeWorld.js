import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    ParticlesTree,
    ParticlesTreeView
} from "./ParticleSystem/Tree/ParticlesTree";
import {
    GalleryTexts
} from "../Resources/GalleryTexts";

class ParticlesTreeWorld extends GameWorld {
    static get Title() {
        return GalleryTexts.ParticlesTreeWorld_Title;
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