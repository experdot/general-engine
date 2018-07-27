import * as EventArgs from "./EventArgs";
import * as Events from "./Events";
import * as Exception from "./Exception";
import * as Inputs from "./Inputs";
import * as Enum from "./Enum";
import * as DelayTimer from "./DelayTimer";
import * as Identifier from "./Identifier";
import {
    Namespace
} from "./Namespace";

/*eslint-disable*/
export const Common = Namespace.combine({
        Namespace
    },
    Enum,
    EventArgs,
    Events,
    Exception,
    Inputs,
    DelayTimer,
    Identifier
);