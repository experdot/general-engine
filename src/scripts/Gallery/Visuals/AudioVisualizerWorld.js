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
import {
    GalleryResources
} from "../Resources/GalleryResource";

class AudioVisualizerWorld extends GameWorld {
    static get Title() {
        return GalleryResources.AudioVisualizerWorld_Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new DragDropInput());
    }

    createObjects() {
        this.addChild(new AudioVisualizer().joint(new AudioVisualizerView()));
    }
}

export {
    AudioVisualizerWorld
};