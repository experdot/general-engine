import { GameWorld } from "@legacy/Engine/Game/GameWorld/GameWorld";
import {
    EndlessAbyss,
    EndlessAbyssView
} from "./EndlessAbyss/EndlessAbyss";
import {
    VisualPointer
} from "../Visuals/VisualPointer/VisualPointer";
import { KeyInput } from "@legacy/Engine/Inputs/KeyInput";
import { PointerInput } from "@legacy/Engine/Inputs/PointerInput";

export class EndlessAbyssWorld extends GameWorld {
    initialize() {
        this.inputs.addInput(new KeyInput());
        this.inputs.addInput(new PointerInput());
        this.addChild(new EndlessAbyss().joint(new EndlessAbyssView()));
        this.joint(new VisualPointer());
    }
}