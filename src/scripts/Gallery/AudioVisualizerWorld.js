import {
    GameWorld
} from "../Engine/Game/GameWorld/GameWorld";
import {
    GameWorldView
} from "../Engine/Game/GameWorld/GameWorldView";
import {
    AudioVisualizer,
    AudioVisualizerView
} from "../Engine/Game/Visual/AudioVisualizer/AudioVisualizer";
import {
    DragDropInput
} from "../Engine/Common/Inputs";

class AudioVisualizerWorld extends GameWorld {
    static get Title() {
        return "Audio - Visualizer";
    }

    initialize() {
        this.bind(new GameWorldView());
        this.inputs.addInput(new DragDropInput());
    }

    createObjects() {
        this.addVisual(new AudioVisualizer(), new AudioVisualizerView());
    }
}

export {
    AudioVisualizerWorld
};