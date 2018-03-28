import {
    AnimationBox
} from "./Engine/Core/AnimationBox";
import {
    ParticlesTreeWorld
} from "./Gallery/ParticlesTreeWorld";
import {
    ParticlesWalkerWorld
} from "./Gallery/ParticlesWalkerWorld";

let natural2D = {
    AnimationBox: AnimationBox,
    ParticlesTreeWorld: ParticlesTreeWorld,
    ParticlesWalkerWorld: ParticlesWalkerWorld
};

window.Natural2D = natural2D;