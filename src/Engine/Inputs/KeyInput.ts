import { InputBase, Inputs, InputEvents } from "./Inputs";
import { Vector2 } from "../Numerics/Vector2";

export class KeyInput extends InputBase {
    regist(inputs: Inputs) {
        super.regist(inputs);
        if (!inputs.key) {
            inputs.key = {
                isKeyDown: false
            };
        }

        this.registEvent("keydown", InputEvents.KeyDown, () => {
            inputs.key.isKeyDown = true;
        }, null, document.body);
        this.registEvent("keyup", InputEvents.KeyUp, () => {
            inputs.key.isKeyDown = false;
        }, null, document.body);
        this.registEvent("keypress", InputEvents.KeyPress, null, null, document.body);
    }
}