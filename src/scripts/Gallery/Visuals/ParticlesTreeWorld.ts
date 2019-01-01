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

export class ParticlesTreeWorld extends GameWorld {
    static get Title(): string {
        return GalleryTexts.ParticlesTreeWorld_Title;
    }

    initialize() {
        this.addChild(new ParticlesTree().joint(new ParticlesTreeView()));
    }
}