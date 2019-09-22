import { GameWorld } from "../../Engine/Game/GameWorld/GameWorld";
import {
    ParticlesTree,
    ParticlesTreeView
} from "./ParticleSystem/Tree/ParticlesTree";

export class ParticlesTreeWorld extends GameWorld {
    initialize() {
        this.addChild(new ParticlesTree().joint(new ParticlesTreeView()));
    }
}