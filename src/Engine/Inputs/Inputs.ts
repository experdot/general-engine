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
        this.dispose();
        this.ui = ui;
        this.inputList.forEach(element => {
            this.regist(element);
        });
        return this;
    }

    dispose() {
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