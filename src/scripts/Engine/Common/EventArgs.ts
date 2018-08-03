/**
 * Represents the base class for classes that contain event data, 
 * and provides a value to use for events that do not include event data.
 */
export class EventArgs {
    constructor() {

    }

    static get empty(): EventArgs {
        return new EventArgs();
    }
}

export class ValueChangedEventArgs extends EventArgs {
    source: any;
    newValue: any;

    constructor(source: any, newValue: any) {
        super();
        this.source = source;
        this.newValue = newValue;
    }
}