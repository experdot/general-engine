import {
    GameWorld
} from "@legacy/Engine/Game/GameWorld/GameWorld";
import { PointerInput } from "@legacy/Engine/Inputs/PointerInput";
import {
    AudioVisualizer,
    AudioVisualizerView
} from "./AudioVisualizer/AudioVisualizer";
import { DragDropInput } from "@legacy/Engine/Inputs/DragDropInput";

export class AudioVisualizerWorld extends GameWorld {
    initialize() {
        this.inputs.addInput(new PointerInput());
        this.inputs.addInput(new DragDropInput());
        this.addChild(new AudioVisualizer().joint(new AudioVisualizerView()));
    }
}