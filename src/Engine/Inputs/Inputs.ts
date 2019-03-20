import { NotImplementedException } from "../Common/Exception";
import { Vector2 } from "../Numerics/Vector2";

export const enum InputEvents {
    Click = "Click",
    MouseDown = "MouseDown",
    MouseUp = "MouseUp",
    MouseMove = "MouseMove",
    MouseEnter = "MouseEnter",
    MouseLeave = "MouseLeave",
    MouseWheel = "MouseWheel",

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
    DragLeave = "DragLeave",
    DragOver = "DragOver",
};

export interface MouseDescription {
    isPressed: boolean;
    position: Vector2;
}

export interface TouchDescription {
    isTouching: boolean;
    position: Vector2;
}

export interface PointerDescription {
    isPressed: boolean;
    position: Vector2;
}

export class Inputs {
    [propName: string]: any;

    mouse?: MouseDescription;
    touch?: TouchDescription;
    pointer?: PointerDescription;

    ui: HTMLElement;
    dispatcher: (...args: any[]) => void;

    private inputList: InputBase[] = [];

    constructor() {
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
        const listener = (event: Event) => {
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
        this.registEvent("dragleave", InputEvents.DragLeave, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
        this.registEvent("dragover", InputEvents.DragOver, (event: DragEvent) => {
            event.stopPropagation();
            event.preventDefault();
        });
    }
}