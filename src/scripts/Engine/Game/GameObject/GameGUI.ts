import { GeneralObject } from "../../Core/GeneralObject";
import { GameGUIInterface } from "../GameInterface/GameInterface";

/** 
 * Represents a GUI attached to the visual object
 */
export class GameGUI extends GeneralObject {
    constructor() {
        super();
        this.implements(GameGUIInterface);
    }
}