import { GeneralObject } from "../../../Core/GeneralObject";
import { GameGUIInterface } from "../GameInterface/GameInterface";

/** 
 * Represents a GUI attached to the visual object
 */
export class GameGUI extends GeneralObject<GameGUIInterface> {
    constructor() {
        super();
        this.implements(new GameGUIInterface());
    }
}