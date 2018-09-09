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
    GalleryTexts
} from "../Resources/GalleryTexts";

export class AudioVisualizerWorld extends GameWorld {
    static get Title(): string {
        return GalleryTexts.AudioVisualizerWorld_Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new DragDropInput());
    }

    createObjects() {
        this.addChild(new AudioVisualizer().joint(new AudioVisualizerView()));
    }
}