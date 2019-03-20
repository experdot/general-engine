import { InputBase, Inputs, InputEvents } from "./Inputs";
import { Vector2 } from "../Numerics/Vector2";

export class PointerInput extends InputBase {
    regist(inputs: Inputs) {
        super.regist(inputs);
        if (!inputs.pointer) {
            inputs.pointer = {
                isPressed: false,
                position: new Vector2(0, 0)
            };
        }
        this.registMouseEvent(inputs);
        this.registTouchEvent(inputs);
    }

    private registMouseEvent(inputs: Inputs) {
        this.registEvent("click", InputEvents.PointerClicked);
        this.registEvent("mouseenter", InputEvents.PointerEntered);
        this.registEvent("mouseleave", InputEvents.PointerExited, () => {
            inputs.pointer.isPressed = false;
        });
        this.registEvent("mousedown", InputEvents.PointerPressed, () => {
            inputs.pointer.isPressed = true;
        });
        this.registEvent("mouseup", InputEvents.PointerReleased, () => {
            inputs.pointer.isPressed = false;
        });
        this.registEvent("mousemove", InputEvents.PointerMoved, (event: MouseEvent) => {
            inputs.pointer.position = new Vector2(event.offsetX, event.offsetY);
        });

        const wheelHandler = (event: Event) => {
            inputs.dispatcher && inputs.dispatcher(InputEvents.MouseWheel, event);
        };
        window.onmousewheel = wheelHandler;
    }

    private registTouchEvent(inputs: Inputs) {
        this.registEvent("touchstart", InputEvents.PointerPressed, (event: TouchEvent) => {
            event.preventDefault();
            inputs.pointer.isPressed = true;
            inputs.pointer.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
        this.registEvent("touchend", InputEvents.PointerReleased, (event: TouchEvent) => {
            event.preventDefault();
            const isRaiseClickEvent = inputs.pointer.isPressed;
            inputs.pointer.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            if (isRaiseClickEvent) {
                (inputs.ui as HTMLElement).click();
            }
        });
        this.registEvent("touchmove", InputEvents.PointerMoved, (event: TouchEvent) => {
            event.preventDefault();
            inputs.pointer.isPressed = true;
            inputs.pointer.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
    }
}