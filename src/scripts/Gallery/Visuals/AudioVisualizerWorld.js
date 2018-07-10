import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
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
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new DragDropInput());
    }

    createObjects() {
        this.addChild(new AudioVisualizer(), new AudioVisualizerView());
    }
}

export {
    AudioVisualizerWorld
};