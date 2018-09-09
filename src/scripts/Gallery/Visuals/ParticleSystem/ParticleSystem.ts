import { GameVisual } from "../../../Engine/Game/GameObject/GameVisual";
import { Particle } from "./Particle";

export class ParticlesBase extends GameVisual {
    particles: Particle[] = [];
}