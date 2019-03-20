import { InputBase, Inputs, InputEvents } from "./Inputs";
import { Vector2 } from "../Numerics/Vector2";

export class TouchInput extends InputBase {
    regist(inputs: Inputs) {
        super.regist(inputs);
        if (!inputs.touch) {
            inputs.touch = {
                isTouching: false,
                position: new Vector2(0, 0)
            };
        }
        this.registTouchEvent(inputs);
    }

    private registTouchEvent(inputs: Inputs) {
        this.registEvent("touchstart", InputEvents.TouchStart, () => {
            inputs.touch.isTouching = true;
        });
        this.registEvent("touchend", InputEvents.TouchEnd, () => {
            inputs.touch.isTouching = false;
        });
        this.registEvent("touchmove", InputEvents.TouchMove, (event: TouchEvent) => {
            event.preventDefault();
            inputs.touch.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
    }
}