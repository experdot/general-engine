import { NotImplementedException } from "./Exception";
import { Vector2 } from "../Numerics/Vector2";

export enum InputEvents {
    Click = "Click",
    MouseDown = "MouseDown",
    MouseUp = "MouseUp",
    MouseMove = "MouseMove",
    MouseEnter = "MouseEnter",
    MouseLeave = "MouseLeave",
    MouseWheel = "MouseWheel",

    Tap = "Tap",
    TouchStart = "TouchStart",
    TouchEnd = "TouchEnd",
    TouchMove = "TouchMove",

    PointerClicked = "PointerClicked",
    PointerPressed = "PointerPressed",
    PointerReleased = "PointerReleased",
    PointerMoved = "PointerMoved",
    PointerEntered = "PointerEntered",
    PointerExited = "PointerExited",
    PointerWheelChanged = "PointerWheelChanged",

    KeyDown = "KeyDown",
    KeyUp = "KeyUp",
    KeyPress = "KeyPress",

    Drop = "Drop",
    DragEnter = "DragEnter",
    DragExit = "DragExit",
    DragOver = "DragOver",
};

export class Inputs {
    [propName: string]: any;

    ui: any;
    dispatcher: (...args: any[]) => void;

    private inputList: any[];

    constructor() {
        this.inputList = [];
        this.dispatcher = () => {
            throw new NotImplementedException("The dispatcher event handler is not configured.");
        };
    }

    change(handler: (...args: any[]) => void) {
        this.dispatcher = handler;
        return this;
    }

    launch(ui: HTMLElement) {
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

    regist(input: InputBase) {
        input.regist(this);
    }

    addInput(input: InputBase) {
        this.inputList.push(input);
    }
}

export class InputBase {
    private events: any[];
    private inputs: Inputs;

    constructor() {
        this.events = [];
    }

    regist(inputs: Inputs) {
        this.inputs = inputs;
    }

    registEvent(sourceName: string, targetName: string, before?: Function, after?: Function, uiElement: HTMLElement = null) {
        let listener = (event: Event) => {
            before && before(event);
            this.inputs.dispatcher(targetName, event);
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

export class MouseInput extends InputBase {
    regist(inputs: Inputs) {
        super.regist(inputs);
        if (!inputs.mouse) {
            inputs.mouse = {
                isPressed: false,
                position: new Vector2(0, 0)
            };
        }
        this._registMouseEvent(inputs);
    }

    _registMouseEvent(inputs: Inputs) {
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

        let wheelHandler = (event: Event) => {
            inputs.dispatcher && inputs.dispatcher(InputEvents.MouseWheel, event);
        };

        window.onmousewheel = wheelHandler;
        document.onmousewheel = wheelHandler;
    }
}

export class TouchInput extends InputBase {
    regist(inputs: Inputs) {
        super.regist(inputs);
        if (!inputs.touch) {
            inputs.touch = {
                isTouching: false,
                position: new Vector2(0, 0)
            };
        }
        this._registTouchEvent(inputs);
    }

    _registTouchEvent(inputs: Inputs) {
        this.registEvent("tap", InputEvents.Tap);
        this.registEvent("touchStart", InputEvents.TouchStart, () => {
            event.stopPropagation();
            event.preventDefault();
            inputs.touch.isTouching = true;
        });
        this.registEvent("touchEnd", InputEvents.TouchEnd, () => {
            event.stopPropagation();
            event.preventDefault();
            inputs.touch.isTouching = false;
        });
        this.registEvent("touchmove", InputEvents.TouchMove, (event: TouchEvent) => {
            event.stopPropagation();
            event.preventDefault();
            inputs.touch.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
    }
}

export class PointerInput extends InputBase {
    regist(inputs: Inputs) {
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

    _registMouseEvent(inputs: Inputs) {
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

        let wheelHandler = (event: Event) => {
            inputs.dispatcher && inputs.dispatcher(InputEvents.MouseWheel, event);
        };
        window.onmousewheel = wheelHandler;
        document.onmousewheel = wheelHandler;
    }
    _registTouchEvent(inputs: Inputs) {
        this.registEvent("tap", InputEvents.PointerClicked);
        this.registEvent("touchstart", InputEvents.PointerPressed, () => {
            event.stopPropagation();
            event.preventDefault();
            inputs.pointer.isPressed = true;
        });
        this.registEvent("touchend", InputEvents.PointerReleased, () => {
            event.stopPropagation();
            event.preventDefault();
            inputs.pointer.isPressed = false;
        });
        this.registEvent("touchmove", InputEvents.PointerMoved, (event: TouchEvent) => {
            event.stopPropagation();
            event.preventDefault();
            inputs.pointer.isPressed = true;
            inputs.pointer.position = new Vector2(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
    }
}

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

export class DragDropInput extends InputBase {
    regist(inputs: Inputs) {
        super.regist(inputs);
        this.registEvent("drop", InputEvents.Drop, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragenter", InputEvents.DragEnter, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragexit", InputEvents.DragExit, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragover", InputEvents.DragOver, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
    }
}