import {GameWorld} from "../../Engine/Game/GameWorld/GameWorld";
import { KeyInput } from "../../Engine/Inputs/KeyInput";
import { PointerInput } from "../../Engine/Inputs/PointerInput";
import { AutoPaint, AutoPaintView } from "./AutoPaint/AutoPaint";

export class AutoPaintWorld extends GameWorld {
    initialize() {
        this.inputs.addInput(new KeyInput());
        this.inputs.addInput(new PointerInput());
        this.addChild(new AutoPaint().joint(new AutoPaintView()));
    }
}