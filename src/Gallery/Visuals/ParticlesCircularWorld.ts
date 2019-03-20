import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    PointerInput
} from "../../Engine/Inputs/Inputs";
import { ParticlesCircular, ParticlesCircularView } from "./ParticleSystem/Circular/ParticlesCircular";

export class ParticlesCircularWorld extends GameWorld {
    static get Title(): string {
        return "Particles - Circular";
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.addChild(new ParticlesCircular().joint(new ParticlesCircularView()));
    }
}