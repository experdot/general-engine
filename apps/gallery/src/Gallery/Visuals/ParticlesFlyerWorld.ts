import { GameWorld } from "@legacy/Engine/Game/GameWorld/GameWorld";
import { PointerInput } from "@legacy/Engine/Inputs/PointerInput";
import {
    ParticlesFlyer,
    ParticlesFlyerView
} from "./ParticleSystem/Flyer/ParticlesFlyer";

export class ParticlesFlyerWorld extends GameWorld {
    initialize() {
        this.inputs.addInput(new PointerInput());
        this.addChild(new ParticlesFlyer().joint(new ParticlesFlyerView()));
    }
}