import { GameVisual } from "../../../Engine/Game/GameObject/GameVisual";
import { Particle } from "./Particle";

export class ParticlesBase<T extends Particle> extends GameVisual {
    particles: T[] = [];
}