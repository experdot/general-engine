import {
    GameWorld
} from "../../Engine/Game/GameWorld/GameWorld";
import { PointerInput } from "../../Engine/Inputs/PointerInput";
import {
    AudioVisualizer,
    AudioVisualizerView
} from "./AudioVisualizer/AudioVisualizer";
import {
    GalleryTexts
} from "../Resources/GalleryTexts";
import { DragDropInput } from "../../Engine/Inputs/DragDropInput";

export class AudioVisualizerWorld extends GameWorld {
    static get Title(): string {
        return GalleryTexts.AudioVisualizerWorld_Title;
    }

    initialize() {
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new DragDropInput());
        this.addChild(new AudioVisualizer().joint(new AudioVisualizerView()));
    }
}