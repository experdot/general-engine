import {
    GameWorld
} from "@legacy/Engine/Game/GameWorld/GameWorld";
import {
    ParticlesWalker,
    ParticlesWalkerView
} from "./ParticleSystem/Walker/ParticlesWalker";

export class ParticlesWalkerWorld extends GameWorld {
    initialize() {
        this.addChild(new ParticlesWalker().joint(new ParticlesWalkerView()));
    }
}