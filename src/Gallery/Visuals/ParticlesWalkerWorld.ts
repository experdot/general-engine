import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    ParticlesWalker,
    ParticlesWalkerView
} from "./ParticleSystem/Walker/ParticlesWalker";
import {
    GalleryTexts
} from "../Resources/GalleryTexts";

export class ParticlesWalkerWorld extends GameWorld {
    static get Title(): string {
        return GalleryTexts.PartilesWalkerWorld_Title;
    }

    initialize() {
        this.addChild(new ParticlesWalker().joint(new ParticlesWalkerView()));
    }
}