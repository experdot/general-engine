import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../../Engine/Game/GameWorld/GameWorldView";
import {
    PointerInput,
    DragDropInput
} from "../../Engine/Common/Inputs";
import {
    AudioVisualizer,
    AudioVisualizerView
} from "./AudioVisualizer/AudioVisualizer";

class AudioVisualizerWorld extends GameWorld {
    static get Title() {
        return "Audio - Visualizer";
    }

    initialize() {
        this.bind(new GameWorldView());
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new DragDropInput());
    }

    createObjects() {
        this.addVisual(new AudioVisualizer(), new AudioVisualizerView());
    }
}

export {
    AudioVisualizerWorld
};