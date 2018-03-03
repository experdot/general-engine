import {
    Color
} from "../Fundamental/Color";
import {
    GameWorld
} from "../Engine/Core/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Core/GameWorld/GameWorldView";
import {
    ParticlesView,
    ParticlesTree
} from "../Engine/Visual/ParticlesTree/ParticlesTree";

class CustomWorld extends GameWorld {
    initialize() {
        this.view = new GameWorldView(this);
        this.view.clearColor = new Color(0, 0, 0);
    }

    createObjects() {
        let visual = new ParticlesTree(new ParticlesView());
        this.addVisual(visual);
    }
}

export {
    CustomWorld
};