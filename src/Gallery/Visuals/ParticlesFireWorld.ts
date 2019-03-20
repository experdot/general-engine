import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import { PointerInput } from "../../Engine/Inputs/PointerInput";
import { ParticlesFireView, ParticlesFire } from "../Visuals/ParticleSystem/Fire/ParticlesFire";

export class ParticlesFireWorld extends GameWorld {
    static get Title() {
        return "Particles - Fire";
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.addChild(new ParticlesFire().joint(new ParticlesFireView()));
    }
}