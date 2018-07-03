import * as EventArgs from "./EventArgs";
import * as EventSystem from "./EventSystem";
import * as Exception from "./Exception";
import * as GeneralGrid from "./GeneralGrid";
import * as Inputs from "./Inputs";
import * as Enum from "./Enum";
import * as DelayTimer from "./DelayTimer";
import {
    Namespace
} from "./Namespace";


/*eslint-disable*/
export const Common = Namespace.combine({
        Namespace
    },
    Enum,
    EventArgs,
    EventSystem,
    Exception,
    GeneralGrid,
    Inputs,
    DelayTimer
);