import {
    GeneralObject
} from "../../Core/GeneralObject";
import {
    GameGUIInterface
} from "../GameInterface/GameInterface";

/** 
 * Represents a GUI attached to the visual object
 */
class GameGUI extends GeneralObject {
    constructor() {
        super();
        this.implements(GameGUIInterface);
    }
}

export {
    GameGUI
};