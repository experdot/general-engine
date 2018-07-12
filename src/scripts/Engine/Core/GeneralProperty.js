import {
    GeneralObject
} from "./GeneralObject";
import {
    EventSystem,
} from "../Common/EventSystem";
import {
    ValueChangedEventArgs
} from "../Common/EventArgs";

class GeneralProperty extends GeneralObject {
    constructor(value, readonly = false, writeonly = false) {
        super();
        this.value = value;
        this.readonly = readonly;
        this.writeonly = writeonly;
        this.eventSystem = new EventSystem();
        this.eventSystem.registEvent("ValueChanged");
    }

    set(value) {
        if (!this.readonly && this.value !== value) {
            this.value = value;
            this.eventSystem.raiseEvent("ValueChanged", new ValueChangedEventArgs(this, value));
        }
        return this;
    }

    get() {
        if (!this.writeonly) {
            return this.value;
        }
    }
}

export {
    GeneralProperty
};