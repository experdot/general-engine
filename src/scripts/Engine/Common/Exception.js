/**
 * Represents errors that occur during application execution.
 */
class Exception {
    constructor(message) {
        this.message = message;
    }
}
/**
 * The exception that is thrown when one of the arguments provided to a method is not valid.
 */
class ArgumentException extends Exception {
    constructor(message = "One of the arguments provided to a method is not valid.") {
        super(message);
    }
}
/**
 * The exception that is thrown when an undefined/null reference is passed to a method that does not accept it as a valid argument.
 */
class ArgumentNullException extends ArgumentException {
    constructor(message = "An undefined/null reference is passed to a method that does not accept it as a valid argument.") {
        super(message);
    }
}
/**
 * The exception that is thrown when the value of an argument is outside the allowable range of values as defined by the invoked method.
 */
class ArgumentOutOfRangeException extends ArgumentException {
    constructor(message = "The value of an argument is outside the allowable range of values as defined by the invoked method.") {
        super(message);
    }
}
/**
 * The exception that is thrown when 
 * an attempt is made to access an element of an array or collection with an index that is outside its bounds.
 */
class IndexOutOfRangeException extends Exception {
    constructor(message = "An attempt is made to access an element of an array or collection with an index that is outside its bounds.") {
        super(message);
    }
}
/**
 * The exception that is thrown when a method call is invalid for the object's current state.
 */
class InvalidOperationException extends Exception {
    constructor(message = "A method call is invalid for the object's current state.") {
        super(message);
    }
}
/**
 * The exception that is thrown when the key specified for accessing an element in an object does not match any key in the object.
 */
class KeyNotFoundException extends Exception {
    constructor(message = "The key specified for accessing an element in an object does not match any key in the object.") {
        super(message);
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
/**
 * The exception that is thrown when an invoked method is not supported, 
 */
class NotSupportedException extends Exception {
    constructor(message = "An invoked method is not supported.") {
        super(message);
    }
}
/**
 * The exception that is thrown when a feature does not run on a particular platform.
 */
class PlatformNotSupportedException extends Exception {
    constructor(message = "A feature does not run on a particular platform.") {
        super(message);
    }
}
/**
 * The exception that is thrown when an array with the wrong number of dimensions is passed to a method.
 */
class RankException extends Exception {
    constructor(message = "An array with the wrong number of dimensions is passed to a method.") {
        super(message);
    }
}
/**
 * The exception that is thrown when the time allotted for a process or operation has expired.
 */
class TimeoutException extends Exception {
    constructor(message = "The time interval allotted to an operation has expired.") {
        super(message);
    }
}

export {
    Exception,
    ArgumentException,
    ArgumentNullException,
    ArgumentOutOfRangeException,
    IndexOutOfRangeException,
    InvalidOperationException,
    KeyNotFoundException,
    NotImplementedException,
    NotSupportedException,
    PlatformNotSupportedException,
    RankException,
    TimeoutException
};