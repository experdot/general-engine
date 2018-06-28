/**
 * Represents the base class for classes that contain event data, 
 * and provides a value to use for events that do not include event data.
 */
class EventArgs {
    constructor() {

    }

    static get empty() {
        return new EventArgs();
    }
}

class ValueChangedEventArgs extends EventArgs {
    constructor(source, newValue) {
        super();
        this.source = source;
        this.newValue = newValue;
    }
}

export {
    EventArgs,
    ValueChangedEventArgs
};