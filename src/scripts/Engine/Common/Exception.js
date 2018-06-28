/**
 * Represents errors that occur during application execution.
 */
class Exception {
    constructor(message) {
        this.message = message;
    }
}

/**
 * The exception that is thrown when a requested method or operation is not implemented.
 */
class NotImplementedException extends Exception {
    constructor(message = "The method is not implemented.") {
        super(message);
    }
}

export {
    Exception,
    NotImplementedException
};