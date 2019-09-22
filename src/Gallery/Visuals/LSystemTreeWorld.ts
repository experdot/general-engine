import { GameWorld } from "../../Engine/Game/GameWorld/GameWorld";
import {
    LSystemTree,
    LSystemTreeView
} from "./LSystem/LSystemTree";
import { PointerInput } from "../../Engine/Inputs/PointerInput";

export class LSystemTreeWorld extends GameWorld {
    initialize() {
        this.inputs.addInput(new PointerInput());
        this.addChild(new LSystemTree().joint(LSystemTree.defaultView));
    }
}