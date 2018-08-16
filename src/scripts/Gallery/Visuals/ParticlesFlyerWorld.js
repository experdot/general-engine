import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    PointerInput
} from "../../Engine/Common/Inputs";
import {
    ParticlesFlyer,
    ParticlesFlyerView
} from "./ParticleSystem/Flyer/ParticlesFlyer";
import {
    GalleryTexts
} from "../Resources/GalleryTexts";

class ParticlesFlyerWorld extends GameWorld {
    static get Title() {
        return GalleryTexts.ParticlesFlyerWorld_Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
    }

    createObjects() {
        this.addChild(new ParticlesFlyer().joint(new ParticlesFlyerView()));
    }
}

export {
    ParticlesFlyerWorld
};