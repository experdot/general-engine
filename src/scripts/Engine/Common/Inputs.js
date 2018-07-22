import {
    Vector2
} from "../../Engine/Numerics/Vector2";
import {
    NotSupportedException
} from "./Exception";
import {
    Enum
} from "./Enum";

const InputEvents = {
    Click: "Click",
    MouseDown: "MouseDown",
    MouseUp: "MouseUp",
    MouseMove: "MouseMove",
    MouseEnter: "MouseEnter",
    MouseLeave: "MouseLeave",
    MouseWheel: "MouseWheel",

    Tap: "Tap",
    TouchStart: "TouchStart",
    TouchEnd: "TouchEnd",
    TouchMove: "TouchMove",

    PointerClicked: "PointerClicked",
    PointerPressed: "PointerPressed",
    PointerReleased: "PointerReleased",
    PointerMoved: "PointerMoved",
    PointerEntered: "PointerEntered",
    PointerExited: "PointerExited",
    PointerWheelChanged: "PointerWheelChanged",

    KeyDown: "KeyDown",
    KeyUp: "KeyUp",
    KeyPress: "KeyPress",

    Drop: "Drop",
    DragEnter: "DragEnter",
    DragExit: "DragExit",
    DragOver: "DragOver",
};
Enum.create(InputEvents);

class Inputs {
    constructor() {
        this.inputList = [];
        this.dispatcher = () => {
            throw new NotSupportedException("The dispatcher event handler is not configured.");
        };
    }

    change(handler) {
        this.dispatcher = handler;
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
            this.inputs.dispatcher & this.inputs.dispatcher(targetName, event);
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
        this.registEvent("mousemove", InputEvents.MouseMove, event => {
            inputs.mouse.position = new Vector2(event.offsetX, event.offsetY);
        });
        window.onmousewheel = document.onmousewheel = (event) => {
            inputs.dispatcher && inputs.dispatcher(InputEvents.MouseWheel, event);
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
        this.registEvent("tap", InputEvents.Tap);
        this.registEvent("touchStart", InputEvents.TouchStart, () => {
            inputs.touch.isTouching = true;
        });
        this.registEvent("touchEnd", InputEvents.TouchEnd, () => {
            inputs.touch.isTouching = false;
        });
        this.registEvent("touchmove", InputEvents.TouchMove, event => {
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
        this.registEvent("mousemove", InputEvents.PointerMoved, event => {
            inputs.pointer.position = new Vector2(event.offsetX, event.offsetY);
        });
        window.onmousewheel = document.onmousewheel = (event) => {
            inputs.dispatcher && inputs.dispatcher(InputEvents.PointerWheelChanged, event);
        };
    }
    _registTouchEvent(inputs) {
        this.registEvent("tap", InputEvents.PointerClicked);
        this.registEvent("touchstart", InputEvents.PointerPressed, () => {
            inputs.pointer.isPressed = true;
        });
        this.registEvent("touchend", InputEvents.PointerReleased, () => {
            inputs.pointer.isPressed = false;
        });
        this.registEvent("touchmove", InputEvents.PointerMoved, event => {
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

        this.registEvent("keydown", InputEvents.KeyDown, () => {
            inputs.key.isKeyDown = true;
        }, null, document);
        this.registEvent("keyup", InputEvents.KeyUp, () => {
            inputs.key.isKeyDown = false;
        }, null, document);
        this.registEvent("keypress", InputEvents.KeyPress, null, null, document);
    }
}

class DragDropInput extends InputBase {
    regist(inputs) {
        super.regist(inputs);
        this.registEvent("drop", InputEvents.Drop, event => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragenter", InputEvents.DragEnter, event => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragexit", InputEvents.DragExit, event => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragover", InputEvents.DragOver, event => {
            event.stopPropagation();
            event.preventDefault();
        });
    }
}

export {
    InputEvents,
    Inputs,
    InputBase,
    MouseInput,
    TouchInput,
    PointerInput,
    KeyInput,
    DragDropInput
};