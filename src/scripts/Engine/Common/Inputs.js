import {
    Vector2
} from "../../Engine/Numerics/Vector2";
import {
    NotSupportedException
} from "./Exception";

class Inputs {
    constructor() {
        this.inputList = [];
        this.handler = () => {
            throw new NotSupportedException("The event hanlder is not configured");
        };
    }

    handle(handler) {
        this.handler = handler;
        return this;
    }

    launch(ui) {
        this.release();
        this.ui = ui;
        this.inputList.forEach(element => {
            this.regist(element);
        });
        return this;
    }

    release() {
        this.inputList.forEach(element => {
            element.release();
        });
        this.ui = null;
    }

    regist(input) {
        input.regist(this);
    }

    addInput(input) {
        this.inputList.push(input);
    }
}

class InputBase {
    constructor() {
        this.events = [];
    }

    regist(inputs) {
        this.inputs = inputs;
    }

    registEvent(sourceName, targetName, before, after, uiElement = null) {
        let listener = (event) => {
            before && before(event);
            this.inputs.handler & this.inputs.handler(targetName, event);
            after && after(event);
        };
        uiElement = uiElement || this.inputs.ui;
        uiElement.addEventListener(sourceName, listener);
        this.events.push({
            ui: uiElement,
            name: sourceName,
            listener: listener
        });
    }

    release() {
        this.events.forEach(event => {
            event.ui.removeEventListener(event.name, event.listener);
        });
    }
}

class MouseInput extends InputBase {
    regist(inputs) {
        super.regist(inputs);
        if (!inputs.mouse) {
            inputs.mouse = {
                isPressed: false,
                position: new Vector2(0, 0)
            };
        }
        this._registMouseEvent(inputs);
    }

    _registMouseEvent(inputs) {
        this.registEvent("click", "Click");
        this.registEvent("mouseenter", "MouseEnter");
        this.registEvent("mouseleave", "MouseLeave");
        this.registEvent("mousedown", "MouseDown", () => {
            inputs.mouse.isPressed = true;
        });
        this.registEvent("mouseup", "MouseUp", () => {
            inputs.mouse.isPressed = false;
        });
        this.registEvent("mousemove", "MouseMove", event => {
            inputs.mouse.position = new Vector2(event.offsetX, event.offsetY);
        });
        window.onmousewheel = document.onmousewheel = (event) => {
            inputs.handler("MouseWheel", event);
        };
    }
}

class TouchInput extends InputBase {
    regist(inputs) {
        super.regist(inputs);
        if (!inputs.touch) {
            inputs.touch = {
                isTouching: false,
                position: new Vector2(0, 0)
            };
        }
        this._registTouchEvent(inputs);
    }

    _registTouchEvent(inputs) {
        this.registEvent("tap", "Tap");
        this.registEvent("touchStart", "TouchStart", () => {
            inputs.touch.isTouching = true;
        });
        this.registEvent("touchEnd", "TouchEnd", () => {
            inputs.touch.isTouching = false;
        });
        this.registEvent("touchmove", "TouchMove", event => {
            event.preventDefault();
            inputs.touch.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
    }
}

class PointerInput extends InputBase {
    regist(inputs) {
        super.regist(inputs);
        if (!inputs.pointer) {
            inputs.pointer = {
                isPressed: false,
                position: new Vector2(0, 0)
            };
        }
        this._registMouseEvent(inputs);
        this._registTouchEvent(inputs);
    }

    _registMouseEvent(inputs) {
        this.registEvent("click", "PointerClicked");
        this.registEvent("mouseenter", "PointerEntered");
        this.registEvent("mouseleave", "PointerExited");
        this.registEvent("mousedown", "PointerPressed", () => {
            inputs.pointer.isPressed = true;
        });
        this.registEvent("mouseup", "PointerReleased", () => {
            inputs.pointer.isPressed = false;
        });
        this.registEvent("mousemove", "PointerMoved", event => {
            inputs.pointer.position = new Vector2(event.offsetX, event.offsetY);
        });
        window.onmousewheel = document.onmousewheel = (event) => {
            inputs.handler("PointerWheelChanged", event);
        };
    }
    _registTouchEvent(inputs) {
        this.registEvent("tap", "PointerClicked");
        this.registEvent("touchstart", "PointerPressed", () => {
            event.preventDefault();
            inputs.pointer.isPressed = true;
        });
        this.registEvent("touchend", "PointerReleased", () => {
            event.preventDefault();
            inputs.pointer.isPressed = false;
        });
        this.registEvent("touchmove", "PointerMoved", event => {
            event.preventDefault();
            inputs.pointer.isPressed = true;
            inputs.pointer.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });

    }
}

class KeyInput extends InputBase {
    regist(inputs) {
        super.regist(inputs);
        if (!inputs.key) {
            inputs.key = {
                isKeyDown: false
            };
        }

        this.registEvent("keydown", "KeyDown", () => {
            inputs.key.isKeyDown = true;
        }, null, document);
        this.registEvent("keyup", "KeyUp", () => {
            inputs.key.isKeyDown = false;
        }, null, document);
        this.registEvent("keypress", "KeyPress", null, null, document);
    }
}

export {
    Inputs,
    InputBase,
    MouseInput,
    TouchInput,
    PointerInput,
    KeyInput
};