import {
    GameVisual
} from "../../../Engine/Game/GameObject/GameVisual";

class ParticlesBase extends GameVisual {
    constructor() {
        super();
        this.particles = [];
    }
}

export {
    ParticlesBase
};