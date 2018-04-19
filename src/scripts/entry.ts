import {
    AnimationBox
} from "./Engine/Core/AnimationBox";
import {
    ParticlesTreeWorld
} from "./Gallery/ParticlesTreeWorld";
import {
    ParticlesWalkerWorld
} from "./Gallery/ParticlesWalkerWorld";
import { ParticlesFlyerWorld } from "./Gallery/ParticlesFlyerWorld";
import { GameStarter } from "./Gallery/GameStarter";

let natural2D = {
    AnimationBox: AnimationBox,
    ParticlesTreeWorld: ParticlesTreeWorld,
    ParticlesWalkerWorld: ParticlesWalkerWorld,
    ParticlesFlyerWorld: ParticlesFlyerWorld,
    GameStarter: GameStarter
};

(window as any).Natural2D = natural2D;