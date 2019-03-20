import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import { PointerInput } from "../../Engine/Inputs/PointerInput";
import {
    ParticlesFlyer,
    ParticlesFlyerView
} from "./ParticleSystem/Flyer/ParticlesFlyer";
import {
    GalleryTexts
} from "../Resources/GalleryTexts";

export class ParticlesFlyerWorld extends GameWorld {
    static get Title(): string {
        return GalleryTexts.ParticlesFlyerWorld_Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.addChild(new ParticlesFlyer().joint(new ParticlesFlyerView()));
    }
}