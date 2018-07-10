import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";

class ParticlesBase extends GameVisual {
    constructor(view) {
        super(view);
        this.particles = [];
    }
}

export {
    ParticlesBase
};