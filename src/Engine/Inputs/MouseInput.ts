import { InputBase, Inputs, InputEvents } from "./Inputs";
import { Vector2 } from "../Numerics/Vector2";

export class MouseInput extends InputBase {
    regist(inputs: Inputs) {
        super.regist(inputs);
        if (!inputs.mouse) {
            inputs.mouse = {
                isPressed: false,
                position: new Vector2(0, 0)
            };
        }
        this.registMouseEvent(inputs);
    }

    private registMouseEvent(inputs: Inputs) {
        this.registEvent("click", InputEvents.Click);
        this.registEvent("mouseenter", InputEvents.MouseEnter);
        this.registEvent("mouseleave", InputEvents.MouseLeave, () => {
            inputs.mouse.isPressed = false;
        });
        this.registEvent("mousedown", InputEvents.MouseDown, () => {
            inputs.mouse.isPressed = true;
        });
        this.registEvent("mouseup", InputEvents.MouseUp, () => {
            inputs.mouse.isPressed = false;
        });
        this.registEvent("mousemove", InputEvents.MouseMove, (event: MouseEvent) => {
            inputs.mouse.position = new Vector2(event.offsetX, event.offsetY);
        });

        const wheelHandler = (event: Event) => {
            inputs.dispatcher && inputs.dispatcher(InputEvents.MouseWheel, event);
        };

        window.onmousewheel = wheelHandler;
    }
}